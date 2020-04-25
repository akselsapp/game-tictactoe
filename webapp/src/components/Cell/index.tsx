import React from "react";

import {PlayerMark} from "../../shared/types";

const Cell = ({onClick, mark}: { mark: PlayerMark | null, onClick: Function }) => (
  <div className="block" onClick={onClick as any}>
    {mark === PlayerMark.CROSS && 'X'}
    {mark === PlayerMark.CIRCLE && 'O'}
  </div>
)
export default Cell;
