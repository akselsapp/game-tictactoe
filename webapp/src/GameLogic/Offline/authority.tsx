import {Game, GameStatus} from "../../shared/types";

const possibleWinningCombinations = [
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


const gameAuthority = (game: Game) => {
  if (!game.player1.id || !game.player2.id) return ({
    winner: '',
    status: GameStatus.WAITING_FOR_OPPONENT,
  })

  const l = [
    game.board[0].split(','),
    game.board[1].split(','),
    game.board[2].split(','),
  ];

  const sameMark = (pc: number[][]) => {
    const a = l[pc[0][0]][pc[0][1]]
    const b = l[pc[1][0]][pc[1][1]]
    const c = l[pc[2][0]][pc[2][1]]

    // if we have a winning combination
    if (a === b && b === c) {
      // it's either player 1
      if (game.player1.mark === a) {
        return {winner: game.player1.id, status: GameStatus.END}
      }
      // or player 2
      if (game.player2.mark === a) {
        return {winner: game.player2.id, status: GameStatus.END}
      }
    }
    return {winner: '', status: GameStatus.ONGOING}
  }

  let sm = {winner: '', status: GameStatus.ONGOING};
  for (const pc of possibleWinningCombinations) {
    sm = sameMark(pc);

    if (sm.winner) {
      return sm;
    }
  }
  return sm;
}

export default gameAuthority;
