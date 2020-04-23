import React from 'react';

import './style.scss'

enum PlayerMark { CROSS = 'X', CIRCLE = 'O' }

enum GameStatus { ONGOING, END}

type Player = {
  mark: PlayerMark
}

type Board = [
  [PlayerMark | null, PlayerMark | null, PlayerMark | null],
  [PlayerMark | null, PlayerMark | null, PlayerMark | null],
  [PlayerMark | null, PlayerMark | null, PlayerMark | null],
]

export type Game = {
  turn: PlayerMark
  winner: Player | null
  status: GameStatus
  player1: Player
  player2: Player
  board: Board
}

const initialState: Game = {
  turn: PlayerMark.CROSS,
  winner: null,
  status: GameStatus.ONGOING,
  player1: {
    mark: PlayerMark.CROSS
  },
  player2: {
    mark: PlayerMark.CIRCLE
  },
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
}

const Block = ({onClick, mark}: { mark: PlayerMark | null, onClick: Function }) => (
  <div className="block" onClick={onClick as any}>
    {mark === PlayerMark.CROSS && 'X'}
    {mark === PlayerMark.CIRCLE && 'O'}
  </div>
)

const Board = ({game, click}: { game: Game, click: Function }) => (
  <div className="board">
    {game.board.map((line, x) => line.map((mark, y) =>
      <Block key={`${x}-${y}`} mark={mark} onClick={() => click(x, y)}/>
    ))}
  </div>
)

const deepCloneGame = (game: Game): Game => ({
  turn: game.turn,
  winner: game.winner,
  status: game.status,
  player1: {...game.player1},
  player2: {...game.player2},
  board: [
    [game.board[0][0], game.board[0][1], game.board[0][2]],
    [game.board[1][0], game.board[1][1], game.board[1][2]],
    [game.board[2][0], game.board[2][1], game.board[2][2]],
  ]
})

const TicTacToe = () => {
  const [game, updateGame] = React.useState<Game>(initialState);
  const [hasStarted, updateHasStarted] = React.useState(false);

  const returnWinner = (__game: Game) => {
    const sameMark = (pc: number[][]) => {
      const a = __game.board[pc[0][0]][pc[0][1]]
      const b = __game.board[pc[1][0]][pc[1][1]]
      const c = __game.board[pc[2][0]][pc[2][1]]

      if (a === b && b === c) {
        return a;
      }
      return null;
    }

    const possibleCombinations = [
      // rows
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      // columns
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      // diagonals
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    for (const pc of possibleCombinations) {
      const sm = sameMark(pc);

      if (sm) {
        return {mark: sm}
      }
    }
    return null;
  }

  const click = (x: number, y: number) => {
    const g: Game = deepCloneGame(game)

    if (g.board[x][y] || g.winner) return;

    g.board[x][y] = game.turn;

    if (g.turn === PlayerMark.CROSS) {
      g.turn = PlayerMark.CIRCLE
    } else {
      g.turn = PlayerMark.CROSS
    }

    g.winner = returnWinner(g)

    updateGame(g)
    updateHasStarted(true)
  }

  const restart = () => {
    updateGame(deepCloneGame(initialState))
    updateHasStarted(false)
  }


  return (
    <div>
      <div className="boardWithUI">
        <div className="UI" style={{ marginBottom: 16}}>
          <h1>
            {game.winner && <><b>{game.winner?.mark}</b> has won!</>}
            {!hasStarted && <>Tic-Tac-Toe</>}
            {!game.winner && hasStarted && <>It's <b>{game.turn}</b> turn</>}
          </h1>
        </div>
        <Board game={game} click={click}/>
        <div className="UI" style={{paddingTop: 16}}>
          {game.winner &&
          <div className="item button-jittery">
            <button onClick={restart}>Restart</button>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
