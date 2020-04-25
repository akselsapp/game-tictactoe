import React from 'react';
import './App.css';
import './button.scss'

import axios from 'axios'

import * as FireService from './services/fire';
import useQueryString from './hooks/useQueryString'

import {Game, GameStatus} from './shared/types'
import newOfflineGame from "./tools/newOfflineGame";

import Board from "./components/Board";

const joinGame = async (user: any, gameID: string) => {
  await axios.post('https://europe-west2-board-games-d4306.cloudfunctions.net/ticTacToe_joinGame', {
    gameID
  }, {
    headers: {
      'Authorization': `Bearer ${await user.getIdToken(false)}`
    }
  })
}

const App = () => {
  const [user, setUser] = React.useState();
  const [userID, setUserID] = React.useState();
  const [error, setError] = React.useState();
  const [game, setGame] = React.useState<Game | null>(null);

  // Use a custom hook to subscribe to the grocery list ID provided as a URL query parameter
  const [gameID, setGameID]: any = useQueryString('gameID');

  // Use an effect to authenticate and load the grocery list from the database
  React.useEffect(() => {
    FireService.authenticateAnonymously().then((userCredentials: any) => {
      setUserID(userCredentials.user.uid);
      setUser(userCredentials.user)

      if (gameID) {
        FireService.getGame(gameID)
          .onSnapshot((convo) => {
            if (convo && convo.exists) {
              setError(null);

              // retrieve the game
              const og = convo.data() as Game
              // join the game
              if (
                (!og.player1.id || !og.player2.id) &&
                (og.player1.id !== userCredentials.user.uid && og.player2.id !== userCredentials.user.uid)) {
                joinGame(userCredentials.user, gameID);
              }

              setGame(og);
            } else {
              setError('game-not-found');
              setGameID();
            }
          })
      }
    }).catch(() => setError('anonymous-auth-failed'));
  }, [gameID, setGameID]);

  const newGame = async () => {
    const token = await user?.getIdToken(false);
    const {data} = await axios.post('https://europe-west2-board-games-d4306.cloudfunctions.net/ticTacToe_newGame', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    setGameID(data.gameID)
  }

  const onCellClick = async (x: number, y: number) => {
    const token = await user?.getIdToken(false);
    await axios.post('https://europe-west2-board-games-d4306.cloudfunctions.net/ticTacToe_click', {
      x, y,
      gameID,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  console.log('OGG', game)

  let playerMark = null;
  if (userID && game) {
    if (game.player1.id === userID)
      playerMark = game.player1.mark;
    if (game.player2.id === userID)
      playerMark = game.player2.mark
  }
  const playerTurn = game ? playerMark === game.turn : false;


  return (
    <div className="App">
      <div className="boardWithUI">
        <div className="UI" style={{marginBottom: 16}}>
          <h1>Tic-Tac-Toe</h1>
        </div>
        {game &&
        <Board
          game={game}
          click={onCellClick}
        />
        }
        <div className="UI" style={{paddingTop: 16}}>
          {game && game.status === GameStatus.ONGOING &&
          <div>
            {playerMark && <p>You are <b>{playerMark}</b> it {playerTurn ? <b>is</b> : <b>is not</b>} your turn</p>}
          </div>
          }

          {game && game.status === GameStatus.END &&
          <div>
            {game.winner &&
            <>You {game.winner === userID ? <b>WON</b> : <b>LOST</b>}</>
            }
            {!game.winner && <>{`It's a `}<b>Tie</b></>}
          </div>
          }
          {game && game.status === GameStatus.WAITING_FOR_OPPONENT &&
          <div>
            <div>Waiting for an <b>opponent</b>.</div>
            <br /><br/>
            Send them this link:<br />
            <small>
              <b>{window.location.href}</b>
            </small>
          </div>
          }

          {!gameID && user &&
          <div>
            <div className="item button-jittery">
              <button onClick={newGame}>Start a new <b>ONLINE</b> GAME</button>
            </div>
            <br/><br/>
            <div className="item button-jittery">
              <button onClick={() => { setGame(newOfflineGame()) }}>Start a new <b>OFFLINE</b> GAME</button>
            </div>
          </div>
          }
        </div>
      </div>

    </div>
  );
}

export default App;
