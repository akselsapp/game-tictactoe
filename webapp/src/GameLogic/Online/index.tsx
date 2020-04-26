import React from 'react';

import * as FireService from '../../services/fire';
import { Game, GameStatus } from '../../shared/types';

import api from './api';

type OnlineWrapperProps = {
  user: any;
  gameID: string;
  setGame: Function;
  setGameID: Function;
  children: Function;
  setLoading: Function;
  setError: Function;
  game: Game | null;
};

const OnlineWrapper = ({
  user,
  game,
  gameID,
  setGame,
  setGameID,
  children,
  setLoading,
  setError,
}: OnlineWrapperProps) => {
  React.useEffect(() => {
    if (!user || !gameID) return;
    setLoading(true);
    FireService.getGame(gameID).onSnapshot((convo) => {
      if (convo && convo.exists) {
        setError(null);

        // retrieve the game
        const og = convo.data() as Game;
        // join the game
        if ((!og.player1.id || !og.player2.id) && og.player1.id !== user.uid && og.player2.id !== user.uid) {
          api.join(user, gameID);
        }

        setGame(og);
      } else {
        setError('Game not found');
        setGameID();
      }
      setLoading(false);
    });
  }, [user, gameID, setGame, setGameID, setError, setLoading]);

  let playerMark: any = null;
  if (user && user.uid && game) {
    if (game.player1.id === user.uid) playerMark = game.player1.mark;
    if (game.player2.id === user.uid) playerMark = game.player2.mark;
  }
  const playerTurn = game ? playerMark === game.turn : false;

  const ui = () => (
    <div style={{ marginBottom: 8 }}>
      {game && game.status === GameStatus.ONGOING && (
        <div>
          {playerMark && (
            <p>
              You are <b>{playerMark}</b> it {playerTurn ? 'is' : 'is not'} your turn
            </p>
          )}
        </div>
      )}

      {game && game.status === GameStatus.END && (
        <div>
          {game.winner && <>You {game.winner === user.uid ? <b>WON</b> : <b>LOST</b>}</>}
          {!game.winner && (
            <>
              {`It's a `}
              <b>Tie</b>
            </>
          )}
        </div>
      )}
      {game && game.status === GameStatus.WAITING_FOR_OPPONENT && (
        <div>
          <div>
            Waiting for an <b>opponent</b>
          </div>
        </div>
      )}
    </div>
  );

  const interactions = () => (
    <div style={{ marginTop: 32 }}>
      {game && game.status === GameStatus.END && (
        <div style={{ marginTop: 32 }}>
          <div className="btn button-jittery">
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await api.resetGame(user, gameID);
                } catch (err) {
                  setError(`could not reset game, sorry: ${err?.response?.data || ''}`);
                }
                // @ts-ignore
                window.dataLayer.push({ event: 'new-online-game' });
                setLoading(false);
              }}
            >
              <b>RESTART</b> GAME
            </button>
          </div>
        </div>
      )}
      {game && game.status === GameStatus.WAITING_FOR_OPPONENT && (
        <>
          Send them this link:
          <br />
          <small>
            <a href={window.location.href}>
              <b>{window.location.href}</b>
            </a>
          </small>
        </>
      )}
    </div>
  );

  return children({ onClick: api.onCellClick(user), ui, interactions });
};

export default OnlineWrapper;
