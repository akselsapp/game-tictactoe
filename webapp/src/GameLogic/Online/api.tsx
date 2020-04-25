import axios from "axios";
import {Game} from "../../shared/types";

const baseURL = 'https://europe-west2-board-games-d4306.cloudfunctions.net'

const joinGame = async (user: any, gameID: string) => {
  await axios.post(`${baseURL}/ticTacToe_joinGame`, {
    gameID
  }, {
    headers: {
      'Authorization': `Bearer ${await user.getIdToken(false)}`
    }
  })
}

const onCellClick = (user: any) => (game: Game, gameID: string) => async (x: number, y: number) => {
  const token = await user?.getIdToken(false);
  await axios.post(`${baseURL}/ticTacToe_click`, {
    x, y,
    gameID,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

const newGame = async (user: any) => {
  const token = await user?.getIdToken(false);
  const {data} = await axios.post(`${baseURL}/ticTacToe_newGame`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return data.gameID;
}


export default {
  join: joinGame,
  onCellClick,
  newGame,
}
