import {Game} from "../shared/types";

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

export default deepCloneGame
