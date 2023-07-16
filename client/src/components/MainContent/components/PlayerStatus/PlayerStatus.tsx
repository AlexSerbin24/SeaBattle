import React from 'react'

type Props = {
    isGameFinished:boolean,
    currentPlayer:string
}
export default function PlayerStatus({isGameFinished, currentPlayer}:Props) {
  return (
    <h3 style={{ textAlign: "center" }}>
    {!isGameFinished
      ? `Current player: ${currentPlayer}`
      : `Winner is ${currentPlayer}`}
  </h3>
  )
}
