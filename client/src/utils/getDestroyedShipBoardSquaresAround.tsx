export default function getDestroyedShipBoardSquaresAround(shipBoardSquares: number[], isRotated: boolean) {
    const shipSize = shipBoardSquares.length;
    const boardSquaresIdsAroundShip = [];
    const [xFinishOffset, yFinishOffset] = isRotated ? [2, shipSize + 1] : [shipSize + 1, 2];
    const firstShipBoardSquareId = shipBoardSquares[0];
    console.log(firstShipBoardSquareId)
    for (let xOffset = -1; xOffset < xFinishOffset; xOffset++) {
        //Is pressed to left side
        const isPressedToLeft = firstShipBoardSquareId % 10 == 0;
        //Is pressed to right side in vertical rotation
        const isPressedToRightVetically = firstShipBoardSquareId % 10 == 9
        //Is pressed to right side in horizontal rotation
        const isPressedToRightHorizontally = firstShipBoardSquareId % 10 + shipSize == 10
        if ((xOffset == -1 && isPressedToLeft) || ((xOffset >= 1 && isPressedToRightVetically) || (xOffset > shipSize - 1 && isPressedToRightHorizontally))) continue;

        for (let yOffset = -1; yOffset < yFinishOffset; yOffset++) {
            //Is pressed to top side 
            const isPressedToTop = firstShipBoardSquareId < 10;
            //Is pressed to bottom side in horizontal rortation
            const isPressedToBottomHorizontally = firstShipBoardSquareId > 89;
            //Is pressed to bottom side in vertical rotation
            const isPressedToBottomVertically = firstShipBoardSquareId + 10 * shipSize > 99;
            if ((yOffset == -1 && isPressedToTop) || ((yOffset >= 1 && isPressedToBottomHorizontally) || (yOffset > shipSize - 1 && isPressedToBottomVertically))) continue;

            const id = firstShipBoardSquareId + (10 * yOffset) + xOffset;
            if (!shipBoardSquares.includes(id)) boardSquaresIdsAroundShip.push(id);
        }
    }
    return boardSquaresIdsAroundShip;
}