import React from 'react'
import { ShipSize } from '../../../../types/ShipSize';

type Props = {
    shipSize: ShipSize
}
export default function Ship({ shipSize }: Props) {
    return (
        <div className='ship' style={{ width: 45 * shipSize + "px" }}>
        </div>
    )
}
