'use client';

import { useReducer, useEffect, useCallback, useState } from 'react';
import { useWakeLock } from '@/hooks/useWakeLock';
import { SoundMenu, type SoundState } from '@/components/game/SoundMenu';
import { gameReducer, initGame } from '@/lib/game/reducer';
import { evaluateHand } from '@/lib/game/poker';
import { SeatRing } from './SeatRing';
import { CommunityCards } from './CommunityCards';
import { ActionBar } from './ActionBar';
import { PotBox } from './PotBox';
import { PhaseBox } from './PhaseBox';
import { StatsPanel } from './StatsPanel';
import { TableTalk } from './TableTalk';
import { TimerBar } from './TimerBar';
import { WinnerOverlay } from './WinnerOverlay';
import { StartScreen } from './StartScreen';

interface GameViewProps {
  activeCount?: number;
  tableId?: string;
}

export function GameView({ activeCount }: GameViewProps) {
  const [sound, setSound] = useState<SoundState>({ music: true, sfx: true });
  const [state, dispatch] = useReducer(gameReducer, undefined, initGame);

  useWakeLock(state.phase !== 'waiting');

  const humanSeat = state.seats.find((s) => s.status === 'human');
  const humanIndex = humanSeat?.index ?? 0;
  const isHumanTurn = !!(state.currentTurnIndex === humanIndex && humanSeat && !humanSeat.folded);
  const toCall = humanSeat
    ? Math.max(0, Math.max(...state.seats.map((s) => s.currentBet)) - humanSeat.currentBet)
    : 0;
  const maxRaise = humanSeat ? Math.min(humanSeat.chips, humanSeat.chips - toCall + 9999) : 0;
  const canCheck = toCall <= 0;

  const handDesc =
    humanSeat && humanSeat.cards.length === 2 && state.communityCards.length >= 3
      ? evaluateHand([...humanSeat.cards, ...state.communityCards]).desc
      : '—';

  useEffect(() => {
    if (state.currentTurnIndex === null) return;
    const seat = state.seats[state.currentTurnIndex];
    if (seat?.status !== 'npc' || seat.folded) return;
    const t = setTimeout(() => dispatch({ type: 'NPC_ACT' }), 600);
    return () => clearTimeout(t);
  }, [state.currentTurnIndex, state.seats]);

  useEffect(() => {
    if (state.currentTurnIndex === null) return;
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, [state.currentTurnIndex]);

  const handleAction = useCallback(
    (action: 'fold' | 'check' | 'call' | 'raise' | 'allin', raiseAmount?: number) => {
      dispatch({ type: 'ACT', action, raiseAmount });
    },
    []
  );

  const handleNextHand = useCallback(() => {
    dispatch({ type: 'NEXT_HAND' });
  }, []);

  const winner = state.winnerSeatIndex != null ? state.seats[state.winnerSeatIndex] : null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#020608]"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 35%, #0a1a22 0%, #000 75%)' }}
    >
      {/* Pseudo-3D bowl table */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div
          className="w-[70%] max-w-[800px] aspect-[2/1] rounded-[50%] border-2 border-[#c9a84c]/40"
          style={{
            background: 'radial-gradient(ellipse at center, #1a4a1a 0%, #0d2810 50%, #050a05 100%)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,.8), 0 0 60px rgba(201,168,76,.15)',
            transform: 'rotateX(12deg) translateZ(-20px)',
          }}
        />
      </div>

      {/* Seats */}
      <SeatRing seats={state.seats} humanSeatIndex={humanIndex} />

      {/* Community cards */}
      <CommunityCards cards={state.communityCards} />

      {/* HUD */}
      <PotBox pot={state.pot} />
      <PhaseBox phase={state.phase} />
      <StatsPanel
        displayName={humanSeat?.displayName ?? 'You'}
        chips={humanSeat?.chips ?? 0}
        bet={humanSeat?.currentBet ?? 0}
        hand={handDesc}
      />
      <TableTalk lines={state.logLines} />
      <TimerBar left={state.turnTimeLeft} total={state.turnTimeTotal} visible={isHumanTurn} />

      {/* Action bar */}
      {isHumanTurn && (
        <ActionBar
          toCall={toCall}
          minRaise={state.minRaise}
          maxRaise={maxRaise}
          chips={humanSeat?.chips ?? 0}
          canCheck={canCheck}
          onAction={handleAction}
        />
      )}

      {/* Overlays */}
      {state.phase === 'waiting' && <StartScreen seats={state.seats} onDeal={() => dispatch({ type: 'START_GAME' })} />}
      {winner && state.phase === 'showdown' && (
        <WinnerOverlay
          winner={winner}
          wonAmount={state.wonAmount}
          winningHand={state.winningHand}
          onNextHand={handleNextHand}
        />
      )}

      {/* Sound menu */}
      <div className="absolute top-4 right-4 z-[250]">
        <SoundMenu sound={sound} onSoundChange={setSound} />
      </div>
    </div>
  );
}
