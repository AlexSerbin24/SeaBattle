import React from 'react'

type Props={
    playername:string,
    trophies:number
}
export default function PlayerInfo({playername, trophies}:Props) {
    return (
        <div className='player-info'>
            <h3>{playername}</h3>
            <h3>Trophies: {trophies}</h3>
        </div>
    )
}
