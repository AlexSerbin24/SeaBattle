import React from 'react';
import ShipPlacement from './components/ShipPlacement/ShipPlacement';
import Button from '../../../UI/Button/Button';
import ShipsState, { shipSizes } from '../../../../types/ShipsState';
import ShipType from '../../../../types/Ship';
import UpdatedShip from '../../../../types/UpdatedShip';

type Props = {
  allowedShips: ShipsState;
  updateShip: (id: number, data: UpdatedShip) => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ShipPlacements({ allowedShips, updateShip, setEditMode }: Props) {
  const placements: React.JSX.Element[] = [];

  // Function to check if all ships are on the board
  function checkIfShipsOnBoard() {
    for (const key in allowedShips) {
      const shipType = key as keyof ShipsState;
      let isAnyShipNotOnBoard = false;

      for (const ship of allowedShips[shipType]) {
        const { x: shipX, y: shipY } = ship.coordinates;
        const { x: placementX, y: placementY } = ship.placement;
        isAnyShipNotOnBoard = shipX === placementX && shipY === placementY;
        if (isAnyShipNotOnBoard) {
          return true;
        }
      }
    }

    return false;
  }

  // Generate ship placements 
  Object.entries(allowedShips).forEach(([key, currentShips]: [string, ShipType[]]) => {
    const shipSize = shipSizes[key as keyof ShipsState];
    placements.push(
      <div key={`rowForShipSize${shipSize}`} className='ship-placement-row'>
        {currentShips.map(ship => (
          <ShipPlacement key={`placementForShip${ship.id}`} shipId={ship.id} shipSize={shipSize} updateShip={updateShip} />
        ))}
      </div>
    );
  });

  // Handler for the save button click
  const saveButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditMode(false);
    for (const key in allowedShips) {
      const shipType = key as keyof ShipsState;
      allowedShips[shipType].forEach(ship => updateShip(ship.id, { placement: { ...ship.coordinates } }));
    }
  };

  // Handler for the reset button click
  const resetButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    for (const key in allowedShips) {
      const shipType = key as keyof ShipsState;
      allowedShips[shipType].forEach(ship => updateShip(ship.id, { coordinates: { ...ship.placement }, isRotated: false }));
    }
  };

  return (
    <div className='ships-placements'>
      <p style={{ textAlign: "center" }}>
        Your board.
        <br />
        Arrange the ships that are available below.
      </p>
      {placements}
      <div>
        <Button disabled={checkIfShipsOnBoard()} className='save-ships-btn' onClick={saveButtonClickHandler}>
          Save
        </Button>
        <Button className='reset-ships-btn' onClick={resetButtonClickHandler}>
          Reset
        </Button>
      </div>
    </div>
  );
}
