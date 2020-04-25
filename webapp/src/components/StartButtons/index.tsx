import React from 'react'
import {GameType} from "../../shared/types";

type StartButtonsPropsType = {
  newOffline: Function,
  newOnline: Function,
  gameType: GameType
}

const StartButtons = ({gameType, newOffline, newOnline}: StartButtonsPropsType) => {
  if (gameType !== GameType.UNSET) return null;

  return (
    <div>
      <div className="item button-jittery">
        <button onClick={() => newOnline()}>Start a new <b>ONLINE</b> GAME</button>
      </div>
      <br/><br/>
      <div className="item button-jittery">
        <button onClick={() => newOffline()}>Start a new <b>OFFLINE</b> GAME
        </button>
      </div>
    </div>
  )
}

export default StartButtons;
