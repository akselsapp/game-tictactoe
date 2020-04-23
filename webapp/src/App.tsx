import React from 'react';
import './App.css';
import './button.scss'

import * as FireService from './services/fire';
import useQueryString from './hooks/useQueryString'

import TicTacToe from './TicTacToe'
import OnlineTicTacToe from "./OnlineTicTacToe";

const App = () => {
  const [user, setUser] = React.useState();
  const [userId, setUserId] = React.useState();
  const [error, setError] = React.useState();
  const [game, setGame] = React.useState();

  // Use a custom hook to subscribe to the grocery list ID provided as a URL query parameter
  const [gameID, setGameID]: any = useQueryString('gameID');

  // Use an effect to authenticate and load the grocery list from the database
  React.useEffect(() => {
    FireService.authenticateAnonymously().then((userCredentials: any) => {
      setUserId(userCredentials.user.uid);

      if (gameID) {
        FireService.getGame(gameID)
        .onSnapshot((convo) => {
            if (convo && convo.exists) {
              setError(null);
              setGame(convo.data());
            } else {
              setError('game-not-found');
              setGameID();
            }
          })

      }
    }).catch(() => setError('anonymous-auth-failed'));
  }, [gameID, setGameID]);

  const updateGame = (obj: any) => {
    FireService.updateGame(gameID, obj);
  }


  return (
    <div className="App">
      {game &&
      <OnlineTicTacToe onlinegame={game} updateGame={updateGame}/>
      }
    </div>
  );
}

export default App;
