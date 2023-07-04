import React from 'react'
import ShipsState from '../../../../../types/ShipsState'
import UpdatedShip from '../../../../../types/UpdatedShip'
import Button from '../../../../UI/Button/Button'
import ShipPlacements from '../../ShipPlacement/ShipPlacements'

type Props ={
    isEditMode:boolean,
    ships:ShipsState,
    updateShipById: (id: number, data: UpdatedShip) =>void,
    editShipsButtonClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    setIsEditMode:React.Dispatch<React.SetStateAction<boolean>>

}
export default function EditShipsPanel({isEditMode, ships, updateShipById,editShipsButtonClickHandler, setIsEditMode}:Props) {
  return (
    isEditMode ? (
        <ShipPlacements allowedShips={ships} updateShip={updateShipById} setEditMode={setIsEditMode} />
    ) : (
        <Button onClick={editShipsButtonClickHandler} className='edit-ships-btn'>
            Edit ships placements
        </Button>
    )
  )
}
