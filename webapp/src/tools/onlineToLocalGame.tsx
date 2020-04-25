import {Game, GameBoard, OnlineGame, PlayerMark} from "../shared/types";

const onlineBlockToLocalBlock = (state: string): (PlayerMark | null) => {
  if (state === `${PlayerMark.CROSS}`) return PlayerMark.CROSS;
  if (state === `${PlayerMark.CIRCLE}`) return PlayerMark.CIRCLE;

  return null;
}

const onlineToLocalGame = (og: OnlineGame) => {
  const l1 = og.board[0].split(',');
  const l2 = og.board[1].split(',');
  const l3 = og.board[2].split(',');

  const b: GameBoard = [
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

export default onlineToLocalGame;
