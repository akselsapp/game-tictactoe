import React from "react";

import * as FireService from "../../services/fire";
import {Game, GameType, GameStatus} from "../../shared/types";

import api from './api'

type OnlineWrapperProps = {
  user: any;
  gameID: string;
  setGame: Function;
  setGameID: Function;
  children: Function;
  game: Game | null;
}

const OnlineWrapper = ({user, game, gameID, setGame, setGameID, children}: OnlineWrapperProps) => {
  const [error, setError] = React.useState();

  React.useEffect(() => {
    if (!user || !gameID) return;
    FireService.getGame(gameID)
      .onSnapshot((convo) => {
        if (convo && convo.exists) {
          setError(null);

          // retrieve the game
          const og = convo.data() as Game
          // join the game
          if (
            (!og.player1.id || !og.player2.id) &&
            (og.player1.id !== user.uid && og.player2.id !== user.uid)) {
            api.join(user, gameID);
          }

          setGame(og);
        } else {
          setError('game-not-found');
          setGameID();
        }
      })
  }, [user, gameID])


  let playerMark: any = null;
  if (user && user.uid && game) {
    if (game.player1.id === user.uid)
      playerMark = game.player1.mark;
    if (game.player2.id === user.uid)
      playerMark = game.player2.mark
  }
  const playerTurn = game ? playerMark === game.turn : false;

  const ui = () => (
    <>
      {game && game.status === GameStatus.ONGOING &&
      <div>
        {playerMark && <p>You are <b>{playerMark}</b> it {playerTurn ? <b>is</b> : <b>is not</b>} your turn</p>}
      </div>
      }

      {game && game.status === GameStatus.END &&
      <div>
        {game.winner &&
        <>You {game.winner === user.uid ? <b>WON</b> : <b>LOST</b>}</>
        }
        {!game.winner && <>{`It's a `}<b>Tie</b></>}
      </div>
      }
      {game && game.status === GameStatus.WAITING_FOR_OPPONENT &&
      <div>
        <div>Waiting for an <b>opponent</b>.</div>
        <br/><br/>
        Send them this link:<br/>
        <small>
          <b>{window.location.href}</b>
        </small>
      </div>
      }
    </>
  )

  const interactions = () => null;

  return children({onClick: api.onCellClick(user), ui, interactions});
}

export default OnlineWrapper
