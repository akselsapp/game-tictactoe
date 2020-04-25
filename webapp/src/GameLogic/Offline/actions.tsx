import deepCloneGame from "../../tools/deepCloneGameObject";
import {Game, GameStatus, PlayerMark} from "../../shared/types";


const click = (game: Game, x: number, y: number) => {
  if (game.winner) return game;
  if (game.status !== GameStatus.ONGOING) return game;

  const g: Game = deepCloneGame(game)

  const line = g.board[x].split(',');

  if (line[y] === PlayerMark.CIRCLE || line[y] === PlayerMark.CROSS) return g;

  line[y] = game.turn;

  g.board[x] = line.join(',');

  if (g.turn === PlayerMark.CROSS) {
    g.turn = PlayerMark.CIRCLE
  } else {
    g.turn = PlayerMark.CROSS
  }

  return g;
}

export default {
  click,
}
