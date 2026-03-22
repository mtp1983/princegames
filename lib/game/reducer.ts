import type { GameState } from './types';
import { createInitialState, startGame, act, runNPCTurn } from './engine';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'ACT'; action: 'fold' | 'check' | 'call' | 'raise' | 'allin'; raiseAmount?: number }
  | { type: 'NEXT_HAND' }
  | { type: 'NPC_ACT' }
  | { type: 'TICK' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return startGame(state);

    case 'ACT': {
      const next = act(state, action.action, action.raiseAmount);
      if (next.currentTurnIndex !== null && next.seats[next.currentTurnIndex]?.status === 'npc') {
        return next;
      }
      return next;
    }

    case 'NPC_ACT': {
      return runNPCTurn(state);
    }

    case 'NEXT_HAND':
      return startGame(state);

    case 'TICK': {
      if (state.currentTurnIndex === null) return state;
      if (state.turnTimeLeft <= 0) return state;
      const next = { ...state, turnTimeLeft: state.turnTimeLeft - 1 };
      if (next.turnTimeLeft <= 0) {
        const seat = state.seats[state.currentTurnIndex];
        if (seat?.status === 'human') {
          return act(state, 'fold');
        }
        return runNPCTurn(state);
      }
      return next;
    }

    default:
      return state;
  }
}

export function initGame(): GameState {
  return createInitialState();
}
