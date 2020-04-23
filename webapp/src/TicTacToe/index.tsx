import React from 'react';

import './style.scss'

const Block = ({ player }: {player: number}) => (
  <div className="block">
    {player === 1 && 'X'}
    {player === 0 && 'O'}
  </div>
)

const Board = () => (
  <div className="board">
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
    <Block player={1} />
  </div>
)

const TicTacToe = () => {
  return (
    <div>
      <Board/>
    </div>
  )
}

export default TicTacToe
