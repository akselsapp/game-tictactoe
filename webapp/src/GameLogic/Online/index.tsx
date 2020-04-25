import React from "react";

import * as FireService from "../../services/fire";
import {Game} from "../../shared/types";

import api from './api'

type OnlineWrapperProps = {
  user: any;
  gameID: string;
  setGame: Function;
  setGameID: Function;
  children: Function;
  game: Game | null;
}

const OnlineWrapper = ({ user, gameID, setGame, setGameID, children }: OnlineWrapperProps ) => {
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

  const ui = () => {

  }

  return children({ onClick: api.onCellClick(user), ui });
}

export default OnlineWrapper
