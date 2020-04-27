import React from 'react';
import { GameType } from '../../shared/types';

type StartButtonsPropsType = {
  newOffline: Function;
  newOnline: Function;
  gameType: GameType;
  loading: boolean;
  user: any;
};

const StartButtons = ({ gameType, newOffline, newOnline, user, loading }: StartButtonsPropsType) => {
  if (gameType !== GameType.UNSET) return null;

  const okOnline = () => (
    <>
      Start a new <b>ONLINE</b> GAME
    </>
  );
  const notOkOnline = () => (
    <>
      Hold on for <b>online</b> game. Connecting you.
    </>
  );

  return (
    <div>
      {!loading && (
        <div className="btn button-jittery">
          <button disabled={!user || loading} onClick={() => newOnline()}>
            {user ? okOnline() : notOkOnline()}
          </button>
        </div>
      )}
      <br />
      <br />
      <div className="btn button-jittery">
        <button disabled={loading} onClick={() => newOffline()}>
          Start a new <b>OFFLINE</b> GAME
        </button>
      </div>
    </div>
  );
};

export default StartButtons;
