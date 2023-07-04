import React, { useRef, useEffect } from 'react'
import { ShipSize } from '../../../../../../types/ShipSize'
import ShipsState from '../../../../../../types/ShipsState'
import UpdatedShip from '../../../../../../types/UpdatedShip';

type Props = {
    shipId: number,
    shipSize: ShipSize,
    updateShip: (id: number, data: UpdatedShip) => void;
}
export default function ShipPlacement({ shipId, shipSize, updateShip }: Props) {
    const placementRef = useRef<HTMLDivElement>(null);

    //Set to each ship it`s placement in edit mode
    useEffect(() => {
        const { left, top } = (placementRef.current as HTMLDivElement).getBoundingClientRect();
        updateShip(shipId,{placement:{x:left, y:top+window.scrollY}})
    }, [])

    return (
        <div ref={placementRef} className='ship-placement' style={{ width: 45 * shipSize }}>
        </div>
    )
}
