import React from 'react'

type Props = {
    isGameFinished:boolean,
    currentPlayer:string
}
export default function PlayerStatus({isGameFinished, currentPlayer}:Props) {
  return (
    <h3 style={{ textAlign: "center" }}>
    {!isGameFinished
      ? `Now it's player turn: ${currentPlayer}`
      : `Winner is ${currentPlayer}`}
  </h3>
  )
}
