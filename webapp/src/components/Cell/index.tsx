import React from "react";

import {PlayerMark} from "../../shared/types";

import './style.scss'

const Cell = ({onClick, loading, mark}: { mark: PlayerMark | null, onClick: Function, loading: boolean }) => {
  const specificStyle = mark === PlayerMark.CIRCLE || mark === PlayerMark.CROSS || loading ? 'cell-disabled' : 'cell-enabled'

  return (
    <div className={`cell ${specificStyle}`} onClick={onClick as any}>
      {mark === PlayerMark.CROSS && 'X'}
      {mark === PlayerMark.CIRCLE && 'O'}
    </div>
  )
}
export default Cell;
