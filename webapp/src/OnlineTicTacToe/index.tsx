import React from 'react';

import './style.scss'

enum PlayerMark { CROSS = 'X', CIRCLE = 'O' }

export enum GameStatus { WAITING_FOR_OPPONENT, ONGOING, END}

type Player = {
  id: string
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

type OnlineBoard = [
  string,
  string,
  string,
]
export type OnlineGame = {
  turn: PlayerMark
  winner: Player | ''
  status: GameStatus
  player1: Player
  player2: Player
  board: OnlineBoard
  hasStarted: boolean
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

const onlineBlockToLocalBlock = (state: string): (PlayerMark | null) => {
  if (state === `${PlayerMark.CROSS}`) return PlayerMark.CROSS;
  if (state === `${PlayerMark.CIRCLE}`) return PlayerMark.CIRCLE;

  return null;
}
const onlineToLocalGame = (og: OnlineGame) => {
  const l1 = og.board[0].split(',');
  const l2 = og.board[1].split(',');
  const l3 = og.board[2].split(',');

  const b: Board = [
    [onlineBlockToLocalBlock(l1[0]), onlineBlockToLocalBlock(l1[1]), onlineBlockToLocalBlock(l1[2])],
    [onlineBlockToLocalBlock(l2[0]), onlineBlockToLocalBlock(l2[1]), onlineBlockToLocalBlock(l2[2])],
    [onlineBlockToLocalBlock(l3[0]), onlineBlockToLocalBlock(l3[1]), onlineBlockToLocalBlock(l3[2])]
  ];

  const g: Game = {
    turn: og.turn,
    status: og.status,
    player1: {...og.player1},
    player2: {...og.player2},
    board: b,
    winner: null,
  }
  return g;
}

const localToOnlineBlock = (a: PlayerMark | null, b: PlayerMark | null, c: PlayerMark | null) =>
  [a || -1, b || -1, c || -1].join(',')

const localToOnlineGame = (g: Game) => {
  const b: OnlineBoard = [
    localToOnlineBlock(g.board[0][0], g.board[0][1], g.board[0][2]),
    localToOnlineBlock(g.board[1][0], g.board[1][1], g.board[1][2]),
    localToOnlineBlock(g.board[2][0], g.board[2][1], g.board[2][2]),
  ]

  const og: OnlineGame = {
    turn: g.turn,
    status: g.status,
    player1: {...g.player1},
    player2: {...g.player2},
    board: b,
    winner: g.winner || '',
    hasStarted: false,
  }
  return og;
}

const OnlineTicTacToe = ({onlinegame, updateGame, onCellClick, hints}: { onlinegame: OnlineGame, updateGame: Function, onCellClick: Function, hints: any }) => {
  const game = onlineToLocalGame(onlinegame)
  const [hasStarted, updateHasStarted] = React.useState(false);
  const [plays, setNumberOfPlays] = React.useState(0);

  const returnWinner = (__game: Game) => {
    const sameMark = (pc: number[][]) => {
      const a = __game.board[pc[0][0]][pc[0][1]]
      const b = __game.board[pc[1][0]][pc[1][1]]
      const c = __game.board[pc[2][0]][pc[2][1]]

      if (a === b && b === c) {
        if (__game.player1.mark === a) {
          return __game.player1;
        }
        return __game.player2;
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
        return sm;
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

    updateGame(localToOnlineGame(g))
    updateHasStarted(true)
    setNumberOfPlays(plays + 1)
  }

  const restart = () => {
    updateHasStarted(false)
    setNumberOfPlays(0)
  }

  console.log('game', game)
  return (
    <div>
      <div className="boardWithUI">
        <div className="UI" style={{marginBottom: 16}}>
          <h1>
            {game.winner && <><b>{game.winner?.mark}</b> has won!</>}
            {!hasStarted && <>Tic-Tac-Toe</>}
            {!game.winner && hasStarted && plays !== 9 && <>It's <b>{game.turn}</b> turn</>}
            {!game.winner && plays === 9 && <>It's a <b>Tie</b></>}
          </h1>
        </div>
        <Board game={game} click={onCellClick}/>
        <div className="UI" style={{paddingTop: 16}}>
          {hints}
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

export default OnlineTicTacToe
