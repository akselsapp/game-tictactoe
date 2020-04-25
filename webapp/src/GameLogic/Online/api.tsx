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

const onCellClick = (user: any) => (game: Game) => async (x: number, y: number, gameID: string) => {
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


export default {
  join: joinGame,
  onCellClick,
}
