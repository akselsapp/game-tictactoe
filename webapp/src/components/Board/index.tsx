import React from "react";

import {Game, PlayerMark} from "../../shared/types";
import Cell from "../Cell";

import './style.scss'

const stringToPlayerMark = (state: string): (PlayerMark | null) => {
  if (state === `${PlayerMark.CROSS}`) return PlayerMark.CROSS;
  if (state === `${PlayerMark.CIRCLE}`) return PlayerMark.CIRCLE;

  return null;
}

const Board = ({game, click}: { game: Game, click: Function }) => {
  const l1 = game.board[0].split(',');
  const l2 = game.board[1].split(',');
  const l3 = game.board[2].split(',');

  const b: [
    [PlayerMark | null, PlayerMark | null, PlayerMark | null],
    [PlayerMark | null, PlayerMark | null, PlayerMark | null],
    [PlayerMark | null, PlayerMark | null, PlayerMark | null]
  ] = [
    [stringToPlayerMark(l1[0]), stringToPlayerMark(l1[1]), stringToPlayerMark(l1[2])],
    [stringToPlayerMark(l2[0]), stringToPlayerMark(l2[1]), stringToPlayerMark(l2[2])],
    [stringToPlayerMark(l3[0]), stringToPlayerMark(l3[1]), stringToPlayerMark(l3[2])]
  ];

  return (
    <div className="board">
      {b.map((line, x) => line.map((mark, y) =>
        <Cell key={`${x}-${y}`} mark={mark} onClick={() => click(x, y)}/>
      ))}
    </div>
  )
}

export default Board;
