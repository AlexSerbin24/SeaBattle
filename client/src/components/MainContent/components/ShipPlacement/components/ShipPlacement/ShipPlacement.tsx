import React, { useState, useRef, useEffect } from 'react'
import { ShipSize } from '../../../../../../types/ShipSize'
import ShipsState from '../../../../../../types/ShipsState'
import UpdatedShip from '../../../../../../types/UpdatedShip';
import getShipBlockDimension from '../../../../../../utils/getShipBlockDimensions';

type Props = {
    shipId: number,
    shipSize: ShipSize,
    isNotOnBoard:boolean,
    updateShip: (id: number, data: UpdatedShip) => void;
}
export default function ShipPlacement({ shipId, shipSize, isNotOnBoard, updateShip }: Props) {
    const placementRef = useRef<HTMLDivElement>(null);
    const [shipPlacementDimensions, setShipPlacementDimensions] = useState({ width: 0, height: 0 })
    //Set to each ship it`s placement in edit mode
    useEffect(() => {
        const { left, top } = (placementRef.current as HTMLDivElement).getBoundingClientRect();
        updateShip(shipId, { placement: { x: left, y: top + window.scrollY } })
    }, [])


    useEffect(() => {
        function handleResize() {
            const {width, height} = getShipBlockDimension();

            if (shipPlacementDimensions.width != width && shipPlacementDimensions.height != height)
                setShipPlacementDimensions({ width, height })
        }

        handleResize(); // Получить начальные размеры элемента

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        const placement = placementRef.current as HTMLDivElement;
        const { x, y } = placement.getBoundingClientRect();
        const updatedShip = isNotOnBoard ? { placement: { x, y: y + window.scrollY }, coordinates: { x, y: y + window.scrollY } } : { placement: { x, y: y + window.scrollY } }
        updateShip(shipId, updatedShip);

    }, [shipPlacementDimensions])




    return (
        <div ref={placementRef} className='ship-placement' style={{ width: shipPlacementDimensions.width * shipSize + "px", height: shipPlacementDimensions.height + "px" }}>
        </div>
    )
}
