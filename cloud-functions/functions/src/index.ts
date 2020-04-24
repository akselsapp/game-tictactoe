import * as functions from 'firebase-functions';

const cors = require('cors');

const corsHandler = cors();

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

enum PlayerMark { CROSS = 'X', CIRCLE = 'O' }

enum GameStatus { WAITING_FOR_OPPONENT, ONGOING, END}

type Player = {
  id: string
  mark: PlayerMark
}
type OnlineBoard = [
  string,
  string,
  string,
]
export type OnlineGame = {
  turn: PlayerMark
  winner: string | ''
  status: GameStatus
  player1: Player
  player2: Player
  board: OnlineBoard
}

const COLLECTION = 'tictactoe';

const initGameData = (): OnlineGame => ({
  turn: PlayerMark.CROSS,
  winner: '',
  status: GameStatus.WAITING_FOR_OPPONENT,
  player1: {
    id: '',
    mark: PlayerMark.CROSS
  },
  player2: {
    id: '',
    mark: PlayerMark.CIRCLE
  },
  board: [
    '-1,-1,-1',
    '-1,-1,-1',
    '-1,-1,-1',
  ],
})

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

const gameAuthority = (game: OnlineGame) => {
  if (!game.player1.id || !game.player2.id) return ({
    winner: '',
    status: GameStatus.WAITING_FOR_OPPONENT,
  })

  const l1 = game.board[0].split(',');
  const l2 = game.board[0].split(',');
  const l3 = game.board[0].split(',');

  const sameMark = (pc: number[][]) => {
    const a = l1[pc[0][0]][pc[0][1]]
    const b = l2[pc[1][0]][pc[1][1]]
    const c = l3[pc[2][0]][pc[2][1]]

    // if we have a winning combination
    if (a === b && b === c) {
      // it's either player 1
      if (game.player1.mark === a) {
        return { winner: game.player1.id, status: GameStatus.END }
      }
      // or 2
      return { winner: game.player2.id, status: GameStatus.END }
    }
    return { winner: '', status: GameStatus.ONGOING }
  }

  let sm = { winner: '', status: GameStatus.ONGOING };
  for (const pc of possibleWinningCombinations) {
    sm = sameMark(pc);

    if (sm.winner) {
      return sm;
    }
  }
  return sm;
}

export const ticTacToe_click = functions.region('europe-west2').https.onRequest((request, response) =>
  corsHandler(request, response, async () => {
    if (!request || !request.headers || !request.headers.authorization) {
      response.status(403).send('Unauthorized');
      return;
    }
    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    const d = request.body;

    if (!d.gameID) {
      response.status(401).send('Missing gameID');
      return;
    }

    if (!(d.x >= 0 || d.x <= 2)) {
      response.status(401).send('x should be between 0 and 2');
      return;
    }
    if (!(d.y >= 0 || d.y <= 2)) {
      response.status(401).send('y should be between 0 and 2');
      return;
    }

    // retrieve the game
    const doc = await admin.firestore().collection(COLLECTION).doc(d.gameID).get();

    // not found game
    if (!doc || !doc.exists) {
      response.status(404).send('Game not found');
      return;
    }

    let game: OnlineGame = doc.data();

    // not part of the game (spectator)
    if (game.player1.id !== decodedIdToken.uid && game.player2.id !== decodedIdToken.uid) {
      response.status(403).send('You are not playing in this game');
      return;
    }

    // retrieve user mark
    const mark = game.player1.id === decodedIdToken.uid ? game.player1.mark : game.player2.mark;

    // check user turn
    if (game.turn !== mark) {
      response.status(401).send(`It's not your turn.`);
      return;
    }

    // check if game is running
    if (game.status !== GameStatus.ONGOING) {
      if (game.status === GameStatus.WAITING_FOR_OPPONENT)
        response.status(401).send(`Game not started yet`);
      if (game.status === GameStatus.END)
        response.status(401).send(`Game ended`);
      return;
    }

    const line = game.board[d.x];
    const values = line.split(',');

    // check if cell is empty
    if (values[d.y] === PlayerMark.CIRCLE || values[d.y] === PlayerMark.CROSS) {
      response.status(401).send(`${d.x}/${d.y} is already marked`);
      return;
    }

    // mark the cell
    values[d.y] = mark;
    game.board[d.x] = values.join(',');
    // change player turn
    game.turn = mark === PlayerMark.CROSS ? PlayerMark.CIRCLE : PlayerMark.CROSS;
    // update game state
    game = {
      ...game,
      ...gameAuthority(game),
    }

    // update game
    await admin.firestore().collection(COLLECTION).doc(d.gameID).update(game);

    response.status(200).send('ok');
    return;
  }));


export const ticTacToe_joinGame = functions.region('europe-west2').https.onRequest((request, response) =>
  corsHandler(request, response, async () => {
    if (!request || !request.headers || !request.headers.authorization) {
      response.status(403).send('Unauthorized');
      return;
    }
    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const userID = decodedIdToken.uid;

    const d = request.body;

    if (!d.gameID) {
      response.status(401).json({
        message: 'Missing gameID',
        payload: d,
      });
      return;
    }

    const doc = await admin.firestore().collection(COLLECTION).doc(d.gameID).get();

    // not found game
    if (!doc || !doc.exists) {
      response.status(404).send('Game not found');
      return;
    }

    const game: OnlineGame = doc.data();

    if (game.player1.id === userID || game.player2.id === userID) {
      response.status(404).send('Already registered');
      return;
    }

    // player1 available
    if (!game.player1.id) {
      game.player1.id = decodedIdToken.uid;

      if (game.player1.id && game.player2.id) {
        game.status = GameStatus.ONGOING;
      }

      await admin.firestore().collection(COLLECTION).doc(d.gameID).update(game);
      response.status(200).json({gameID: d.game, joinedAs: 'player1'});
      return;
    }

    // player2 available
    if (!game.player2.id) {
      game.player2.id = decodedIdToken.uid;

      if (game.player1.id && game.player2.id) {
        game.status = GameStatus.ONGOING;
      }
      await admin.firestore().collection(COLLECTION).doc(d.gameID).update(game);
      response.status(200).json({gameID: d.game, joinedAs: 'player2'});
      return;
    }

    response.status(403).send('Game already full');
  }));


export const ticTacToe_newGame = functions.region('europe-west2').https.onRequest((request, response) =>
  corsHandler(request, response, async () => {
    const g = initGameData();

    // response.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    // response.set('Access-Control-Allow-Methods', 'POST')

    if (!request || !request.headers || !request.headers.authorization) {
      response.status(403).send('Unauthorized');
    }

    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];

    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    g.player1.id = decodedIdToken.uid;

    const writeResult = await admin.firestore().collection(COLLECTION).add(g);
    response.status(200).json({gameID: writeResult.id, user: decodedIdToken});
  }));
