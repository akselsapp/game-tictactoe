import React from 'react';
import './App.css';
import './button.scss'

import axios from 'axios'

import * as FireService from './services/fire';
import useQueryString from './hooks/useQueryString'

import {Game, GameStatus, GameType} from './shared/types'
import newOfflineGame from "./tools/newOfflineGame";

import Board from "./components/Board";

import OnlineWrapper from "./GameLogic/Online";
import OfflineWrapper from "./GameLogic/Offline";
import StartButtons from "./components/StartButtons";


const App = () => {
  const [gameType, setGameType] = React.useState<GameType>(GameType.UNSET)

  const [user, setUser] = React.useState();
  const [userID, setUserID] = React.useState();
  const [error, setError] = React.useState();
  const [game, setGame] = React.useState<Game | null>(null);

  // retrieve gameID from URL
  const [gameID, setGameID]: any = useQueryString('gameID');

  // authenticate the user
  React.useEffect(() => {
    FireService.authenticateAnonymously().then((userCredentials: any) => {
      setUserID(userCredentials.user.uid);
      setUser(userCredentials.user)
    }).catch(() => setError('anonymous-auth-failed'));
  }, []);

  const newGame = async () => {
    const token = await user?.getIdToken(false);
    const {data} = await axios.post('https://europe-west2-board-games-d4306.cloudfunctions.net/ticTacToe_newGame', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    setGameID(data.gameID)
  }

  const startOfflineGame = () => {
    setGame(newOfflineGame())
    setGameType(GameType.OFFLINE)
  }


  let playerMark = null;
  if (userID && game) {
    if (game.player1.id === userID)
      playerMark = game.player1.mark;
    if (game.player2.id === userID)
      playerMark = game.player2.mark
  }
  const playerTurn = game ? playerMark === game.turn : false;

  const wrapper = {
    [GameType.OFFLINE]: OfflineWrapper,
    [GameType.ONLINE]: OnlineWrapper,
    [GameType.UNSET]: () => null,
  }
  const GameWrapper = wrapper[gameType]

  console.log('game', game)

  return (
    <div className="App">
      <div className="boardWithUI">
        <div className="UI" style={{marginBottom: 16}}>
          <h1>Tic-Tac-Toe</h1>
        </div>
        <GameWrapper user={user} gameID={gameID} setGame={setGame} setGameID={setGameID} game={game}>
          {({onClick, ui}: { onClick: Function, ui: Function }) => (
            <>
              {game &&
              <Board
                game={game}
                click={onClick(game)}
              />
              }
              <div className="UI">
                {ui()}
              </div>
            </>
          )}
        </GameWrapper>
        {/*
        <div className="UI" style={{paddingTop: 16}}>
          {game && gameType === GameType.OFFLINE &&
            <>
              {game.status === GameStatus.ONGOING &&
                <>
                  It's <b>{game.turn}</b> turn
                </>
              }
            </>
          }
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
            <br/><br/>
            Send them this link:<br/>
            <small>
              <b>{window.location.href}</b>
            </small>
          </div>
          }
          */}

        <StartButtons newOffline={startOfflineGame} newOnline={() => null} gameType={gameType}/>
      </div>

    </div>
  );
}

export default App;
