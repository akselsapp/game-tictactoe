
export enum PlayerMark { CROSS = 'X', CIRCLE = 'O' }

export enum GameStatus { WAITING_FOR_OPPONENT, ONGOING, END}

export type Player = {
  id: string
  mark: PlayerMark
}

export type GameBoard = [
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
  board: GameBoard
}

export type OnlineBoard = [
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
