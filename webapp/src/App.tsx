import React from 'react';
import './App.css';
import './button.scss';

import * as FireService from './services/fire';
import useQueryString from './hooks/useQueryString';

import { Game, GameType } from './shared/types';
import newOfflineGame from './tools/newOfflineGame';

import Board from './components/Board';

import OnlineWrapper from './GameLogic/Online';
import OfflineWrapper from './GameLogic/Offline';
import StartButtons from './components/StartButtons';
import api from './GameLogic/Online/api';
import * as Fire from './services/fire';

const App = () => {
  // retrieve gameID from URL
  const [gameID, setGameID]: any = useQueryString('gameID');

  const [gameType, setGameType] = React.useState<GameType>(gameID ? GameType.ONLINE : GameType.UNSET);

  const [user, setUser] = React.useState();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [game, setGame] = React.useState<Game | null>(null);

  // authenticate the user
  React.useEffect(() => {
    FireService.authenticateAnonymously()
      .then((userCredentials: any) => {
        setUser(userCredentials.user);
      })
      .catch(() => setError('anonymous-auth-failed'));
  }, []);

  const startOnlineGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const gameID = await api.newGame(user);

      setGameID(gameID);
      setGameType(GameType.ONLINE);
    } catch (e) {
      setError('Sorry, could not create a game');
    }
    Fire.analytics.logEvent('new_online_game', { type: 'new' });
    setLoading(false);
  };
  const startOfflineGame = () => {
    Fire.analytics.logEvent('new_offline_game', { type: 'new' });
    setError(null);
    setGame(newOfflineGame());
    setGameType(GameType.OFFLINE);
  };
  const reset = () => {
    setError(null);
    setGameID('');
    setGame(null);
    setGameType(GameType.UNSET);
  };

  const wrapper = {
    [GameType.OFFLINE]: OfflineWrapper,
    [GameType.ONLINE]: OnlineWrapper,
    [GameType.UNSET]: () => null,
  };
  const GameWrapper = wrapper[gameType];

  return (
    <div className="App">
      <div className="boardWithUI">
        <div className="UI" style={{ marginBottom: 16 }}>
          <h1 onClick={reset}>Tic-Tac-Toe</h1>
        </div>
        <GameWrapper
          user={user}
          gameID={gameID}
          setGame={setGame}
          setGameID={setGameID}
          game={game}
          setLoading={setLoading}
          setError={setError}
        >
          {({ onClick, ui, interactions }: { onClick: Function; ui: Function; interactions: Function }) => (
            <>
              <div className="indications">{ui()}</div>
              {game && (
                <Board
                  loading={loading}
                  game={game}
                  click={async (x: number, y: number) => {
                    setLoading(true);
                    setError(null);
                    try {
                      await onClick(game, gameID)(x, y);
                    } catch (err) {
                      setError(err?.response?.data || 'Could not click right now');
                    }
                    setLoading(false);
                  }}
                />
              )}
              <div className="actions">
                {loading && (
                  <div className="loading-wrap">
                    <div className="loading" />
                  </div>
                )}
                <div className="error">{error}</div>
                {interactions()}
              </div>
            </>
          )}
        </GameWrapper>
        <StartButtons
          newOffline={startOfflineGame}
          newOnline={startOnlineGame}
          gameType={gameType}
          user={user}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default App;
