import type { Seat, GameState, PlayerAction } from './types';

export type AIStyle = 'tight' | 'loose' | 'aggressive' | 'balanced' | 'maniac';

export function decideAction(seat: Seat, state: GameState, style: AIStyle): PlayerAction {
  const toCall = Math.max(...state.seats.map((s) => s.currentBet)) - seat.currentBet;
  const canCheck = toCall <= 0;
  const potOdds = toCall > 0 ? toCall / (state.pot + toCall) : 0;

  if (seat.chips <= toCall) return 'allin';

  const r = Math.random();
  const roll = () => Math.random();

  switch (style) {
    case 'tight':
      if (canCheck && roll() < 0.7) return 'check';
      if (toCall > seat.chips * 0.2 && roll() < 0.6) return 'fold';
      if (roll() < 0.3) return 'raise';
      return toCall > 0 ? 'call' : 'check';
    case 'loose':
      if (canCheck && roll() < 0.4) return 'check';
      if (toCall > seat.chips * 0.5 && roll() < 0.3) return 'fold';
      if (roll() < 0.5) return 'raise';
      return toCall > 0 ? 'call' : 'check';
    case 'aggressive':
      if (canCheck && roll() < 0.2) return 'check';
      if (toCall > seat.chips * 0.4 && roll() < 0.4) return 'fold';
      if (roll() < 0.6) return 'raise';
      return toCall > 0 ? 'call' : 'check';
    case 'maniac':
      if (roll() < 0.1) return 'fold';
      if (roll() < 0.5) return 'allin';
      if (roll() < 0.8) return 'raise';
      return toCall > 0 ? 'call' : 'check';
    case 'balanced':
    default:
      if (canCheck && roll() < 0.5) return 'check';
      if (toCall > seat.chips * 0.3 && potOdds > 0.4 && roll() < 0.5) return 'fold';
      if (roll() < 0.35) return 'raise';
      return toCall > 0 ? 'call' : 'check';
  }
}

export function getRaiseAmount(seat: Seat, state: GameState, style: AIStyle): number {
  const minRaise = state.minRaise;
  const maxBet = Math.min(seat.chips, state.pot * 0.5 + minRaise);
  const r = Math.random();
  switch (style) {
    case 'tight':
      return Math.max(minRaise, Math.floor(maxBet * (0.3 + r * 0.2)));
    case 'loose':
      return Math.max(minRaise, Math.floor(maxBet * (0.5 + r * 0.4)));
    case 'aggressive':
      return Math.max(minRaise, Math.floor(maxBet * (0.6 + r * 0.4)));
    case 'maniac':
      return seat.chips;
    default:
      return Math.max(minRaise, Math.floor(maxBet * (0.4 + r * 0.3)));
  }
}
