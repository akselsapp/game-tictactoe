import React from 'react';

import gameAuthority from './authority';
import actions from './actions';
import { Game, GameStatus } from '../../shared/types';
import newOfflineGame from '../../tools/newOfflineGame';

import * as Fire from '../../services/fire';

type OfflineWrapperProps = {
  user: any;
  gameID: string;
  setGame: Function;
  setGameID: Function;
  children: Function;
  game: Game | null;
};

const OfflineWrapper = ({ game, setGame, children }: OfflineWrapperProps) => {
  if (!game) return null;

  const onClick = (g: Game) => (x: number, y: number) => {
    const g = actions.click(game, x, y);

    setGame({
      ...g,
      ...gameAuthority(g),
    });
  };

  const ui = () => (
    <>
      {game.status === GameStatus.ONGOING && (
        <>
          It's <b>{game.turn}</b> turn
        </>
      )}
      {game.status === GameStatus.END && game.winner && (
        <>
          <b>
            {game.winner === game.player1.id && game.player1.mark}
            {game.winner === game.player2.id && game.player2.mark}
          </b>{' '}
          won!
        </>
      )}
      {game.status === GameStatus.END && !game.winner && (
        <>
          It's a <b>Tie</b>
        </>
      )}
    </>
  );

  const interactions = () => {
    if (game.status === GameStatus.END) {
      return (
        <div style={{ marginTop: 32 }}>
          <div className="btn button-jittery">
            <button
              onClick={() => {
                setGame(newOfflineGame());
                Fire.analytics.logEvent('new_offline_game', { type: 'restart' });
              }}
            >
              <b>RESTART</b> GAME
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return children({ onClick, ui, interactions });
};

export default OfflineWrapper;
