import deepCloneGame from './deepCloneGameObject';

import { Game, GameStatus, PlayerMark } from '../shared/types';

const initialState: Game = {
  turn: PlayerMark.CROSS,
  winner: '',
  hasStarted: false,
  status: GameStatus.ONGOING,
  player1: {
    id: 'tic',
    mark: PlayerMark.CROSS,
  },
  player2: {
    id: 'tac',
    mark: PlayerMark.CIRCLE,
  },
  board: ['-1,-1,-1', '-1,-1,-1', '-1,-1,-1'],
};

export default () => deepCloneGame(initialState);
