import React from 'react';


import {Game} from "../shared/types";

import Board from "../components/Board";

const OnlineTicTacToe = ({game, onCellClick}: { game: Game, onCellClick: Function }) => {

  console.log('game', game)
  return (
    <div>
      <Board game={game} click={onCellClick}/>
    </div>
  )
}

export default OnlineTicTacToe
