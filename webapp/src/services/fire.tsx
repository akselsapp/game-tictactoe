import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import firebaseConfig from './fireConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const analytics = firebase.analytics();

const COLLECTION = 'tictactoe';

export const authenticateAnonymously = () => firebase.auth().signInAnonymously();

export const getGame = (gameID: string) => db.collection(COLLECTION).doc(gameID);
