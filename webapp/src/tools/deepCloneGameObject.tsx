import {Game} from "../shared/types";

const deepCloneGame = (game: Game): Game => ({
  turn: game.turn,
  winner: game.winner,
  hasStarted: game.hasStarted,
  status: game.status,
  player1: {...game.player1},
  player2: {...game.player2},
  board: [
    game.board[0],
    game.board[1],
    game.board[2],
  ]
})

export default deepCloneGame
