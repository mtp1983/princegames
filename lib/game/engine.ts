import type { GameState, Seat, Card, GamePhase, LogLine } from './types';
import { createDeck, evaluateHand } from './poker';
import { decideAction, getRaiseAmount, type AIStyle } from './ai';

const NPC_NAMES = [
  { name: 'Shadow', emoji: '🦊', style: 'aggressive' as AIStyle },
  { name: 'Luna', emoji: '🌙', style: 'balanced' as AIStyle },
  { name: 'Blaze', emoji: '🔥', style: 'maniac' as AIStyle },
  { name: 'River', emoji: '🎲', style: 'loose' as AIStyle },
  { name: 'Vex', emoji: '⚡', style: 'tight' as AIStyle },
  { name: 'Nova', emoji: '✨', style: 'balanced' as AIStyle },
  { name: 'Rune', emoji: '📜', style: 'tight' as AIStyle },
  { name: 'Ace', emoji: '🃏', style: 'aggressive' as AIStyle },
];

export function createInitialState(): GameState {
  const seats: Seat[] = [];
  for (let i = 0; i < 9; i++) {
    seats.push({
      index: i,
      status: i === 0 ? 'human' : 'npc',
      playerId: i === 0 ? 'you' : null,
      displayName: i === 0 ? 'You' : NPC_NAMES[i - 1]!.name,
      emoji: i === 0 ? '👑' : NPC_NAMES[i - 1]!.emoji,
      chips: 1500,
      currentBet: 0,
      folded: false,
      isDealer: false,
      isActive: false,
      cards: [],
      isAllIn: false,
    });
  }
  return {
    phase: 'waiting',
    pot: 0,
    communityCards: [],
    seats,
    currentTurnIndex: null,
    turnTimeLeft: 30,
    turnTimeTotal: 30,
    minRaise: 40,
    bigBlind: 20,
    smallBlind: 10,
    started: false,
    winnerSeatIndex: null,
    winningHand: null,
    wonAmount: 0,
    logLines: [],
  };
}

let deck: Card[] = [];
let logId = 0;

function addLog(state: GameState, text: string, type: LogLine['type'] = 'info'): LogLine[] {
  return [...state.logLines, { id: `log-${++logId}`, text, type }];
}

export function startGame(state: GameState): GameState {
  deck = createDeck();
  const seats = state.seats.map((s) => ({
    ...s,
    cards: [] as Card[],
    currentBet: 0,
    folded: false,
    isDealer: false,
    isActive: false,
    isAllIn: false,
  }));

  const dealerIndex = state.started ? (state.seats.findIndex((s) => s.isDealer) + 1) % 9 : 0;
  seats[dealerIndex]!.isDealer = true;

  const sb = (dealerIndex + 1) % 9;
  const bb = (dealerIndex + 2) % 9;
  seats[sb]!.currentBet = state.smallBlind;
  seats[sb]!.chips -= state.smallBlind;
  seats[bb]!.currentBet = state.bigBlind;
  seats[bb]!.chips -= state.bigBlind;

  let pot = state.smallBlind + state.bigBlind;

  for (let i = 0; i < 9; i++) {
    const idx = (dealerIndex + 3 + i) % 9;
    seats[idx]!.cards = [deck.pop()!, deck.pop()!];
  }

  const firstToAct = (bb + 1) % 9;
  seats[firstToAct]!.isActive = true;

  let log = addLog({ ...state, logLines: [] }, 'New hand. Good luck!', 'info');
  log = addLog({ ...state, logLines: log } as GameState, `Small blind $${state.smallBlind}, Big blind $${state.bigBlind}`, 'info');

  return {
    ...state,
    phase: 'preflop',
    pot,
    communityCards: [],
    seats,
    currentTurnIndex: firstToAct,
    turnTimeLeft: 30,
    turnTimeTotal: 30,
    started: true,
    winnerSeatIndex: null,
    winningHand: null,
    logLines: log,
    minRaise: state.bigBlind,
  };
}

export function act(state: GameState, action: 'fold' | 'check' | 'call' | 'raise' | 'allin', raiseAmount?: number): GameState {
  const idx = state.currentTurnIndex;
  if (idx === null) return state;
  const seat = state.seats[idx];
  if (!seat || seat.folded) return state;

  const toCall = Math.max(...state.seats.map((s) => s.currentBet)) - seat.currentBet;
  const maxRaise = seat.chips - toCall;
  let newPot = state.pot;
  const newSeats = state.seats.map((s) => ({ ...s }));
  let log = state.logLines;

  if (action === 'fold') {
    newSeats[idx]!.folded = true;
    log = addLog(state, `${seat.displayName} folds`, 'action');
  } else if (action === 'check') {
    log = addLog(state, `${seat.displayName} checks`, 'action');
  } else if (action === 'call') {
    const amount = Math.min(toCall, seat.chips);
    newSeats[idx]!.chips -= amount;
    newSeats[idx]!.currentBet += amount;
    newPot += amount;
    log = addLog(state, `${seat.displayName} calls $${amount}`, 'action');
  } else if (action === 'raise' || action === 'allin') {
    const amount = action === 'allin' ? seat.chips : Math.min(Math.max(raiseAmount ?? state.minRaise, state.minRaise), seat.chips);
    const totalBet = seat.currentBet + amount;
    newSeats[idx]!.chips -= amount;
    newSeats[idx]!.currentBet = totalBet;
    newPot += amount;
    if (amount >= seat.chips) newSeats[idx]!.isAllIn = true;
    log = addLog(state, `${seat.displayName} ${action === 'allin' ? 'goes all in' : 'raises'} $${amount}`, 'action');
  }

  const inHand = newSeats.filter((s) => !s.folded);
  if (inHand.length <= 1) {
    return showdown({ ...state, seats: newSeats, pot: newPot, logLines: log });
  }

  const nextIdx = nextActiveSeat(newSeats, idx);
  const allActed = checkAllActed(newSeats, state.phase);
  if (allActed) {
    return advancePhase({ ...state, seats: newSeats, pot: newPot, logLines: log });
  }
  if (nextIdx === null) {
    return showdown({ ...state, seats: newSeats, pot: newPot, logLines: log });
  }

  newSeats.forEach((s, i) => (s.isActive = i === nextIdx));
  return {
    ...state,
    seats: newSeats,
    pot: newPot,
    currentTurnIndex: nextIdx,
    turnTimeLeft: 30,
    turnTimeTotal: 30,
    logLines: log,
    minRaise: Math.max(
      state.minRaise,
      Math.max(...newSeats.map((s) => s.currentBet)) - Math.min(...newSeats.filter((s) => !s.folded).map((s) => s.currentBet))
    ),
  };
}

function nextActiveSeat(seats: Seat[], from: number): number | null {
  for (let i = 1; i <= 9; i++) {
    const idx = (from + i) % 9;
    const s = seats[idx]!;
    if (!s.folded && !s.isAllIn && s.chips > 0) return idx;
  }
  return null;
}

function checkAllActed(seats: Seat[], phase: GamePhase): boolean {
  const maxBet = Math.max(...seats.map((s) => s.currentBet));
  const inHand = seats.filter((s) => !s.folded);
  const allSame = inHand.every((s) => s.currentBet === maxBet || s.isAllIn);
  return allSame && inHand.length >= 2;
}

function advancePhase(state: GameState): GameState {
  const phaseOrder: GamePhase[] = ['preflop', 'flop', 'turn', 'river', 'showdown'];
  const i = phaseOrder.indexOf(state.phase);
  if (i < 0 || i >= 4) return showdown(state);

  const nextPhase = phaseOrder[i + 1]!;
  const newCommunity = [...state.communityCards];
  if (nextPhase === 'flop') {
    newCommunity.push(deck.pop()!, deck.pop()!, deck.pop()!);
  } else if (nextPhase === 'turn' || nextPhase === 'river') {
    newCommunity.push(deck.pop()!);
  }

  const newSeats = state.seats.map((s) => ({ ...s, currentBet: 0, isActive: false }));
  const dealerIdx = newSeats.findIndex((s) => s.isDealer) ?? 0;
  let firstToAct = (dealerIdx + 1) % 9;
  while (newSeats[firstToAct]!.folded || newSeats[firstToAct]!.isAllIn) {
    firstToAct = (firstToAct + 1) % 9;
    if (firstToAct === (dealerIdx + 1) % 9) break;
  }
  newSeats[firstToAct]!.isActive = true;

  const log = addLog(state, `--- ${nextPhase.toUpperCase()} ---`, 'info');

  if (nextPhase === 'showdown') return showdown({ ...state, phase: nextPhase, communityCards: newCommunity, seats: newSeats, logLines: log });

  return {
    ...state,
    phase: nextPhase,
    communityCards: newCommunity,
    seats: newSeats,
    currentTurnIndex: firstToAct,
    turnTimeLeft: 30,
    turnTimeTotal: 30,
    logLines: log,
  };
}

function showdown(state: GameState): GameState {
  const inHand = state.seats.filter((s) => !s.folded);
  if (inHand.length === 1) {
    const winner = inHand[0]!;
    const newSeats = state.seats.map((s) =>
      s.index === winner.index ? { ...s, chips: s.chips + state.pot } : s
    );
    const log = addLog(state, `${winner.displayName} wins $${state.pot}!`, 'win');
    return {
      ...state,
      phase: 'showdown',
      pot: 0,
      seats: newSeats,
      currentTurnIndex: null,
      winnerSeatIndex: winner.index,
      winningHand: '—',
      wonAmount: state.pot,
      logLines: log,
    };
  }

  const hands = inHand.map((s) => ({
    seat: s,
    cards: [...s.cards, ...state.communityCards],
    rank: evaluateHand([...s.cards, ...state.communityCards]),
  }));
  hands.sort((a, b) => b.rank.value - a.rank.value);
  const winner = hands[0]!;
  const newSeats = state.seats.map((s) =>
    s.index === winner.seat.index ? { ...s, chips: s.chips + state.pot } : s
  );
  const log = addLog(state, `${winner.seat.displayName} wins $${state.pot} with ${winner.rank.desc}!`, 'win');
  return {
    ...state,
    phase: 'showdown',
    pot: 0,
    seats: newSeats,
    currentTurnIndex: null,
    winnerSeatIndex: winner.seat.index,
    winningHand: winner.rank.desc,
    wonAmount: state.pot,
    logLines: log,
  };
}

export function runNPCTurn(state: GameState): GameState {
  const idx = state.currentTurnIndex;
  if (idx === null) return state;
  const seat = state.seats[idx];
  if (!seat || seat.status !== 'npc' || seat.folded) return state;

  const style = (NPC_NAMES.find((n) => n.name === seat.displayName) ?? NPC_NAMES[0]!).style;
  const action = decideAction(seat, state, style);
  const raiseAmount = action === 'raise' ? getRaiseAmount(seat, state, style) : undefined;
  return act(state, action, raiseAmount);
}
