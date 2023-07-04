import React, { useMemo } from 'react';
import Ship from '../Ship/Ship';
import ShipsState, { shipSizes } from '../../../../types/ShipsState';
import ShipType from '../../../../types/Ship';
import UpdatedShip from '../../../../types/UpdatedShip';

type Props = {
  allowedShips: ShipsState;
  isEditMode: boolean;
  isGameStarted: boolean;
  updateShip: (id: number, data: UpdatedShip)=>void;
};


export default function Ships({ isEditMode, isGameStarted, allowedShips, updateShip }: Props) {

  const ships = useMemo(() => {
    const result: React.JSX.Element[] = [];

    Object.entries(allowedShips).forEach(([key, currentShips]) => {
      const shipSize = shipSizes[key as keyof ShipsState];

      currentShips.forEach((ship: ShipType) => {
        result.push(
          <Ship
            key={ship.id}
            id={ship.id}
            shipSize={shipSize}
            isEditMode={isEditMode}
            isRotated={ship.isRotated}
            isGameStarted={isGameStarted}
            shipCoordinates={ship.coordinates}
            shipPlacements={ship.placement }
            updateShip={updateShip}
          />
        );
      });
    });

    return result;
  }, [allowedShips, isEditMode, isGameStarted]);

  return <>{ships}</>;
}