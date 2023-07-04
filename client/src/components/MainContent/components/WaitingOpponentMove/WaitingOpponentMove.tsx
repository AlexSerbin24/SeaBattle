import React from 'react'

type Props = {
    isWaiting: boolean
}
export default function WaitingOpponentMove({ isWaiting }: Props) {
    const classes = ["waiting-block"];
    if (!isWaiting) {
        classes.push("invisible");
    }

    return (
        <div className={classes.join(' ')}>
        </div>
    )
}
