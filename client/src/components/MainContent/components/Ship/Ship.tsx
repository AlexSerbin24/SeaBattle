import React, { useState, useEffect, useRef } from 'react'
import { ShipSize } from '../../../../types/ShipSize';
import UpdatedShip from '../../../../types/UpdatedShip';

type Props = {
    id: number,
    isRotated: boolean,
    isEditMode: boolean,
    isGameStarted: boolean,
    shipSize: ShipSize,
    shipCoordinates: { x: number, y: number },
    shipPlacements: { x: number, y: number },
    boardSquaresIds: number[],
    updateShip: (id: number, data: UpdatedShip) => void;
}

export default function Ship({ id, shipSize, isGameStarted, isEditMode, shipCoordinates, shipPlacements, isRotated, boardSquaresIds, updateShip }: Props) {
    const shipRef = useRef<HTMLDivElement>(null);
    const [isDraggable, setIsDraggable] = useState(false);
    const [isPositionOnBoardFound, setIsPositionOnBoardFound] = useState(false);
    const [isPositionOnBoardConfirmed, setIsPositionOnBoardConfirmed] = useState(true);
    const [mouseShifts, setMouseShifts] = useState({ shiftX: 0, shiftY: 0 });

    const blockWidth = 45; // Ship block width
    const blockHeight = 46; //Ship block height
    const classes = ["ship", "draggable"];

    //current width and height in default rotation
    let width = blockWidth * shipSize;
    let height = blockHeight;

    //TODO: should be optimizate
    useEffect(() => {
        if (!isDraggable) return;

        const shipElement = shipRef.current as HTMLDivElement;
        const { shiftX, shiftY } = mouseShifts;

        const onMouseMoveHandler = (event: MouseEvent) => {
            if (isPositionOnBoardConfirmed) setIsPositionOnBoardConfirmed(false);
            shipElement.hidden = true;
            const targetElement = document.elementFromPoint(
                event.pageX - shiftX + blockWidth / 2,
                event.pageY - shiftY + blockHeight / 2 - window.scrollY
            );


            //check if availiable block on board is found
            if (targetElement && targetElement?.tagName === "TD") {

                const { top: tdTop, left: tdLeft } = targetElement.getBoundingClientRect();

                //check if neighboring blocks are not occupied by other ships.
                //position is availiable when all neighboring blocks are not occupied and ship is not out of bounds
                let isUnavailablePosition = false;

                //take into account rotaion of the ship
                //if it is rotated then it placed vertically so y final point will be equal in loop from -1 to shipSize +  and x final point will be equal 2
                //if it's horizontal, then everything is opposite. 
                let [yFinishOffset, xFinishOffset] = isRotated ? [shipSize + 1, 2] : [2, shipSize + 1];

                for (let yOffset = -1; yOffset < yFinishOffset; yOffset++) {
                    for (let xOffset = -1; xOffset < xFinishOffset; xOffset++) {
                        const shipTargetElement = document.elementFromPoint(
                            tdLeft + blockWidth * xOffset + blockWidth / 2,
                            tdTop + blockHeight * yOffset + blockHeight / 2
                        );

                        // check if ship is out of bounds;
                        const isOutOfBounds = !isRotated ?
                            ((xOffset > 0 && xOffset != shipSize && yOffset == 0 && shipTargetElement?.tagName !== "TD"))
                            :
                            ((yOffset > 0 && yOffset != shipSize && xOffset == 0 && shipTargetElement?.tagName !== "TD"))

                        isUnavailablePosition = shipTargetElement?.classList.contains("ship") || isOutOfBounds;
                        if (isUnavailablePosition) break;
                    }
                    if (isUnavailablePosition) break;
                }

                // if position is available we change state of isPositionOnBoardFound but dont confirm it
                if (!isUnavailablePosition) {
                    setIsPositionOnBoardFound(true);
                    updateShip(id, { coordinates: { x: tdLeft, y: tdTop + window.scrollY } })

                    shipElement.hidden = false;
                    return;
                }
            }

            //if the position is not available or  mouse is not on the board, simply change the position of  ship.

            setIsPositionOnBoardFound(false);

            const x = event.pageX - shiftX;
            const y = event.pageY - shiftY;
            shipElement.hidden = false;
            updateShip(id, { coordinates: { x, y } })
        };

        document.addEventListener("mousemove", onMouseMoveHandler);
        return () => {
            document.removeEventListener("mousemove", onMouseMoveHandler);
        };
    }, [isDraggable]);

    if (isRotated) {
        [width, height] = [blockWidth, blockHeight * shipSize];
    }

    if (isPositionOnBoardFound) {
        classes.push("ship-place-found");
    }

    const onMouseDownHandler = !isGameStarted ? (event: React.MouseEvent<HTMLDivElement>) => {
        const shipElement = shipRef.current as HTMLDivElement;
        const { top, left } = shipElement.getBoundingClientRect();
        const shiftX = event.pageX - left;
        const shiftY = event.pageY - top - window.scrollY;
        setMouseShifts({ shiftX, shiftY });
        setIsDraggable(true);

    } : undefined;

    const onMouseUpHandler = !isGameStarted ? (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDraggable(false);
        //if ship is placed on board then mouse up  should  rotate it
        if (isPositionOnBoardConfirmed) {
            //if ship size equlas 1 rotating doesnt have sense
            if (shipSize != 1) {
                //check if ship is placed close to border. If it rotated we should check left border, if not then check bottom
                let [x, y] = isRotated ?
                    [shipCoordinates.x + blockWidth + blockWidth / 2, shipCoordinates.y + blockHeight / 2 - window.scrollY]
                    :
                    [shipCoordinates.x + blockWidth + blockWidth / 2, shipCoordinates.y + blockHeight + blockHeight / 2 - window.scrollY];

                const targetElement = document.elementFromPoint(x, y);
                if (targetElement?.tagName != "TD") return;

                //check if neighboring blocks in potenitally rotated position are not occupied by other ships.
                // also check if ship blocks dont extend out of border
                for (let offset = -1; offset < 2; offset++) {

                    for (let point = 2; point < shipSize + 1; point++) {
                        //if ship is rotated then check blocks on x line, if not then on y line
                        [x, y] = isRotated ?
                            [shipCoordinates.x + blockWidth * point + blockWidth / 2, shipCoordinates.y + blockHeight * offset + blockHeight / 2 - window.scrollY]
                            :
                            [shipCoordinates.x + blockWidth * offset + blockWidth / 2, shipCoordinates.y + blockHeight * point + blockHeight / 2 - window.scrollY];
                        const shipTargetElement = document.elementFromPoint(x, y);
                        if (shipTargetElement?.classList.contains("ship") || (offset == 0 && point < shipSize && shipTargetElement?.tagName !== "TD")) return;

                    }

                }
                const newBoardSquaresIds = [...boardSquaresIds];
                for (let shipBlock = 1; shipBlock < shipSize; shipBlock++) {
                    newBoardSquaresIds[shipBlock] = isRotated ? newBoardSquaresIds[0] + shipBlock : newBoardSquaresIds[0] + 10 * shipBlock;
                }
                updateShip(id, { isRotated: !isRotated, boardSquaresIds: newBoardSquaresIds })
            }
            return;
        }
        //if position is not available or mouse pointer is not on board then return ship to placement
        if (!isPositionOnBoardFound) {
            updateShip(id, { coordinates: { ...shipPlacements }, isRotated: isEditMode ? false : isRotated, boardSquaresIds: isEditMode?[]:[...boardSquaresIds] })
            return;
        }
        //if is edit mode off then return ship to its last placement on board;
        if (!isEditMode) {
            updateShip(id, { placement: { ...shipCoordinates } });
        }

        const shipElement = shipRef.current as HTMLDivElement;

        shipElement.hidden = true;
        const td = document.elementFromPoint(shipCoordinates.x + blockWidth / 2, shipCoordinates.y + blockHeight / 2 - window.scrollY) as HTMLTableCellElement;
        const tr = td.parentNode as HTMLTableRowElement;
        const colId = Array.from(tr.children as HTMLCollection).indexOf(td) - 1;
        const rowId = Array.from(tr.parentNode?.children as HTMLCollection).indexOf(tr) - 1;
        shipElement.hidden = false;

        console.log(colId, rowId)
        const shipBoardSquares = [rowId * 10 + colId];
        for (let boardSquare = 1; boardSquare < shipSize; boardSquare++) {
            const nextBoardSquareStep = isRotated ? 10 : 1;
            shipBoardSquares[boardSquare] = shipBoardSquares[0] + nextBoardSquareStep * boardSquare;
            
        }
        updateShip(id, { boardSquaresIds: shipBoardSquares })
        setMouseShifts({ shiftX: 0, shiftY: 0 });
        setIsPositionOnBoardFound(false);
        setIsPositionOnBoardConfirmed(true);

    } : undefined;

    return (
        <div ref={shipRef} onMouseDown={onMouseDownHandler} onMouseUp={onMouseUpHandler} className={classes.join(" ")} style={{ width: width + "px", height: height + "px", top: shipCoordinates.y, left: shipCoordinates.x }}>
        </div>
    )
}
