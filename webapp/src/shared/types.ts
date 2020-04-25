export enum PlayerMark { CROSS = 'X', CIRCLE = 'O' }

export enum GameStatus { WAITING_FOR_OPPONENT, ONGOING, END}

export enum GameType { UNSET, OFFLINE, ONLINE}

export type Player = {
  id: string
  mark: PlayerMark
}


export type GameBoard = [
  string,
  string,
  string,
]

export type Game = {
  turn: PlayerMark
  winner: string;
  status: GameStatus
  player1: Player
  player2: Player
  board: GameBoard
  hasStarted: boolean
}
