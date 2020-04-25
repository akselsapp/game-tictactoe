import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import firebaseConfig from './fireConfig'

import { OnlineGame } from '../shared/types'

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const COLLECTION = 'tictactoe';

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};


export const getGame = (gameID: string) => {
  return db.collection(COLLECTION)
    .doc(gameID)
};

export const updateGame = (gameID: string, obj: OnlineGame) => {
  return db.collection(COLLECTION)
    .doc(gameID)
    .update(obj)
}
