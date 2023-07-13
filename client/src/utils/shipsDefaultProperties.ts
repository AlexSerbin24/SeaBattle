import Ship from "../types/Ship";

export function getLargeShipsDefaultCoordinates(shipBlocks: NodeListOf<HTMLTableCellElement>):Omit<Ship, "id">[] {
    const { x, y } = shipBlocks[55].getBoundingClientRect();
    return [
        {
            coordinates: { x, y: y + window.scrollY },
            placement: { x, y: y + window.scrollY },
            isRotated: true,
            boardSquaresIds:[55,65,75,85]
        },
    ];
}

export function getMediumShipsDefaultCoordinates(shipBlocks: NodeListOf<HTMLTableCellElement>) :Omit<Ship, "id">[]  {
    const { x: mediumShipX1, y: mediumShipY1 } = shipBlocks[47].getBoundingClientRect();
    const { x: mediumShipX2, y: mediumShipY2 } = shipBlocks[41].getBoundingClientRect();

    return [
        {
            coordinates: { x: mediumShipX1, y: mediumShipY1 + window.scrollY },
            placement: { x: mediumShipX1, y: mediumShipY1 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[47,48,49]
        },
        {
            coordinates: { x: mediumShipX2, y: mediumShipY2 + window.scrollY },
            placement: { x: mediumShipX2, y: mediumShipY2 + window.scrollY },
            isRotated: true,
            boardSquaresIds:[41,51,61]
        },
    ];
}

export function getSmallShipsDefaultCoordinates(shipBlocks: NodeListOf<HTMLTableCellElement>) :Omit<Ship, "id">[]  {
    const { x: smallShipX1, y: smallShipY1 } = shipBlocks[15].getBoundingClientRect();
    const { x: smallShipX2, y: smallShipY2 } = shipBlocks[91].getBoundingClientRect();
    const { x: smallShipX3, y: smallShipY3 } = shipBlocks[87].getBoundingClientRect();

    return [
        {
            coordinates: { x: smallShipX1, y: smallShipY1 + window.scrollY },
            placement: { x: smallShipX1, y: smallShipY1 + window.scrollY },
            isRotated: true,
            boardSquaresIds:[15,25]
        },
        {
            coordinates: { x: smallShipX2, y: smallShipY2 + window.scrollY },
            placement: { x: smallShipX2, y: smallShipY2 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[91,92]
        },
        {
            coordinates: { x: smallShipX3, y: smallShipY3 + window.scrollY },
            placement: { x: smallShipX3, y: smallShipY3 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[87,88]
        },
    ];
}
  
  export function getTinyShipsDefaultCoordinates(shipBlocks: NodeListOf<HTMLTableCellElement>) :Omit<Ship, "id">[]  {
    const { x: tinyShipX1, y: tinyShipY1 } = shipBlocks[10].getBoundingClientRect();
    const { x: tinyShipX2, y: tinyShipY2 } = shipBlocks[3].getBoundingClientRect();
    const { x: tinyShipX3, y: tinyShipY3 } = shipBlocks[28].getBoundingClientRect();
    const { x: tinyShipX4, y: tinyShipY4 } = shipBlocks[73].getBoundingClientRect();

    return [
        {
            coordinates: { x: tinyShipX1, y: tinyShipY1 + window.scrollY },
            placement: { x: tinyShipX1, y: tinyShipY1 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[10]
        },
        {
            coordinates: { x: tinyShipX2, y: tinyShipY2 + window.scrollY },
            placement: { x: tinyShipX2, y: tinyShipY2 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[3]
        },
        {
            coordinates: { x: tinyShipX3, y: tinyShipY3 + window.scrollY },
            placement: { x: tinyShipX3, y: tinyShipY3 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[28]
        },
        {
            coordinates: { x: tinyShipX4, y: tinyShipY4 + window.scrollY },
            placement: { x: tinyShipX4, y: tinyShipY4 + window.scrollY },
            isRotated: false,
            boardSquaresIds:[73]
        },
    ];
}
