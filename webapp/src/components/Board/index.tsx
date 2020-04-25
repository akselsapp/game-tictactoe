import React from "react";

import {Game} from "../../shared/types";
import Cell from "../Cell";

import './style.scss'

const Board = ({game, click}: { game: Game, click: Function }) => (
  <div className="board">
    {game.board.map((line, x) => line.map((mark, y) =>
      <Cell key={`${x}-${y}`} mark={mark} onClick={() => click(x, y)}/>
    ))}
  </div>
)

export default Board;
