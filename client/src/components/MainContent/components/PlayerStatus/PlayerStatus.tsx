import React from 'react'

type Props = {
    isGameFinished:boolean,
    currentPlayer:string,
    winner:string
}
export default function PlayerStatus({isGameFinished, currentPlayer, winner}:Props) {
  return (
    <h3 style={{ textAlign: "center" }}>
    {!isGameFinished
      ? `Current player: ${currentPlayer}`
      : `Winner is ${winner}`}
  </h3>
  )
}
