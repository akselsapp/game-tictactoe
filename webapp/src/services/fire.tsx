import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import firebaseConfig from './fireConfig'

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const COLLECTION = 'tictactoe';

export const authenticateAnonymously = () => firebase.auth().signInAnonymously();

export const getGame = (gameID: string) => db.collection(COLLECTION).doc(gameID);

