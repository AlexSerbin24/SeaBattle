import React from 'react'

type Props={
    playername:string,
    trophies:number
}
export default function PlayerInfo({playername, trophies}:Props) {
    return (
        <>
            <h3 style={{ textAlign: "center" }}>{playername}</h3>
            <h3 style={{ textAlign: "center" }}>Trophies: {trophies}</h3>
        </>
    )
}
