import React from 'react';
import './App.css';
import './button.scss'

import * as FireService from './services/fire';
import useQueryString from './hooks/useQueryString'

import {Game, GameType} from './shared/types'
import newOfflineGame from "./tools/newOfflineGame";

import Board from "./components/Board";

import OnlineWrapper from "./GameLogic/Online";
import OfflineWrapper from "./GameLogic/Offline";
import StartButtons from "./components/StartButtons";
import api from "./GameLogic/Online/api";


const App = () => {
  // retrieve gameID from URL
  const [gameID, setGameID]: any = useQueryString('gameID');

  const [gameType, setGameType] = React.useState<GameType>(gameID ? GameType.ONLINE : GameType.UNSET)

  const [user, setUser] = React.useState();
  const [userID, setUserID] = React.useState();
  const [error, setError] = React.useState();
  const [game, setGame] = React.useState<Game | null>(null);

  // authenticate the user
  React.useEffect(() => {
    FireService.authenticateAnonymously().then((userCredentials: any) => {
      setUserID(userCredentials.user.uid);
      setUser(userCredentials.user)
    }).catch(() => setError('anonymous-auth-failed'));
  }, []);

  const startOnlineGame = async () => {
    const gameID = await api.newGame(user);
    setGameID(gameID)
    setGameType(GameType.ONLINE);
  }
  const startOfflineGame = () => {
    setGame(newOfflineGame())
    setGameType(GameType.OFFLINE)
  }
  const reset = () => {
    setGameID('');
    setGame(null);
    setGameType(GameType.UNSET)
  }

  const wrapper = {
    [GameType.OFFLINE]: OfflineWrapper,
    [GameType.ONLINE]: OnlineWrapper,
    [GameType.UNSET]: () => null,
  }
  const GameWrapper = wrapper[gameType]

  return (
    <div className="App">
      <div className="boardWithUI">
        <div className="UI" style={{marginBottom: 16}}>
          <h1 onClick={reset}>Tic-Tac-Toe</h1>
        </div>
        <GameWrapper user={user} gameID={gameID} setGame={setGame} setGameID={setGameID} game={game}>
          {({onClick, ui}: { onClick: Function, ui: Function }) => (
            <>
              {game &&
              <Board
                game={game}
                click={onClick(game, gameID)}
              />
              }
              <div className="UI">
                {ui()}
              </div>
            </>
          )}
        </GameWrapper>
        <StartButtons newOffline={startOfflineGame} newOnline={startOnlineGame} gameType={gameType} user={user}/>
      </div>

    </div>
  );
}

export default App;
