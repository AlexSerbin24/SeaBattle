import React, { useState, useEffect, useRef } from 'react'
import { ShipSize } from '../../../../types/ShipSize';
import UpdatedShip from '../../../../types/UpdatedShip';
import getShipBlockDimension from '../../../../utils/getShipBlockDimensions';

type Props = {
    id: number,
    isRotated: boolean,
    isEditMode: boolean,
    isGameStarted: boolean,
    shipSize: ShipSize,
    shipCoordinates: { x: number, y: number },
    shipPlacements: { x: number, y: number },
    boardSquaresIds: number[],
    gameBoardRef: React.RefObject<HTMLTableElement>,
    updateShip: (id: number, data: UpdatedShip) => void;
}

export default function Ship({ id, shipSize, isGameStarted, isEditMode, shipCoordinates, shipPlacements, isRotated, boardSquaresIds, gameBoardRef, updateShip }: Props) {
    const shipRef = useRef<HTMLDivElement>(null);
    const [shipBlockDimensions, setShipBlockDimensions] = useState({ width: 0, height: 0 })
    const [shipDimensions, setShipDimensions] = useState({ width: 0, height: 0 })
    const [isDraggable, setIsDraggable] = useState(false);
    const [isPositionOnBoardFound, setIsPositionOnBoardFound] = useState(false);
    const [isPositionOnBoardConfirmed, setIsPositionOnBoardConfirmed] = useState(true);
    const [mouseShifts, setMouseShifts] = useState({ shiftX: 0, shiftY: 0 });


    const classes = ["ship", "draggable"];

    type TouchOrClickEvent = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>;
    const isTouchDevice = `ontouchstart` in window || navigator.maxTouchPoints > 0;
    //current width and height in default rotation



    useEffect(() => {
        function handleResize() {

            const {width,height} = getShipBlockDimension();

            setShipBlockDimensions({ width, height });
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const gameBoard = gameBoardRef.current as HTMLTableElement;
        if (boardSquaresIds.length) {
            const firstBoardSquareId = boardSquaresIds[0];
            const td = gameBoard.querySelectorAll("td").item(firstBoardSquareId);
            const { x, y } = td.getBoundingClientRect();
            const updatedShip = isEditMode?{ coordinates: { x, y: y + window.scrollY }}:{ coordinates: { x, y: y + window.scrollY }, placement: { x, y: y + window.scrollY } };
            updateShip(id, updatedShip);

        }
    }, [shipBlockDimensions, isEditMode, boardSquaresIds]);
    

    useEffect(() => {
        if (isGameStarted) {
            if (window.innerWidth < 620) {

                const gameBoard = gameBoardRef.current as HTMLTableElement;
                const firstBoardSquareId = boardSquaresIds[0];
                const td = gameBoard.querySelectorAll("td").item(firstBoardSquareId);
                const { x, y } = td.getBoundingClientRect();
                updateShip(id, { coordinates: { x, y: y + window.scrollY } });
            }
        }
    }, [isGameStarted])


    useEffect(() => {
        const [width, height] = isRotated ? [shipBlockDimensions.width, shipBlockDimensions.height * shipSize] : [shipBlockDimensions.width * shipSize, shipBlockDimensions.height];
        setShipDimensions({ width, height })
    }, [isRotated, shipBlockDimensions.width, shipBlockDimensions.height])


    //TODO: should be optimizate
    useEffect(() => {
        if (!isDraggable) return;

        const shipElement = shipRef.current as HTMLDivElement;
        const { shiftX, shiftY } = mouseShifts;

        let type: keyof DocumentEventMap = isTouchDevice ? "touchmove" : "mousemove";
        const onMouseMoveHandler = (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            if (isPositionOnBoardConfirmed) setIsPositionOnBoardConfirmed(false);
            shipElement.hidden = true;
            let pageX = 0;
            let pageY = 0;

            if (event instanceof MouseEvent) {
                pageX = event.pageX;
                pageY = event.pageY;
            }
            if (event instanceof TouchEvent) {
                pageX = event.touches[0].pageX;
                pageY = event.touches[0].pageY;
            }
            const targetElement = document.elementFromPoint(
                pageX - shiftX + shipBlockDimensions.width / 2,
                pageY - shiftY + shipBlockDimensions.height / 2 - window.scrollY
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
                            tdLeft + shipBlockDimensions.width * xOffset + shipBlockDimensions.width / 2,
                            tdTop + shipBlockDimensions.height * yOffset + shipBlockDimensions.height / 2
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

            const x = pageX - shiftX;
            const y = pageY - shiftY;
            shipElement.hidden = false;
            updateShip(id, { coordinates: { x, y } })
        };

        document.addEventListener(type, onMouseMoveHandler, { passive: false });

        return () => {
            document.removeEventListener(isTouchDevice ? "touchmove" : "mousemove", onMouseMoveHandler);
        };
    }, [isDraggable]);


    if (isPositionOnBoardFound) {
        classes.push("ship-place-found");
    }

    const onMouseDownHandler = !isGameStarted ? (event: TouchOrClickEvent) => {
        const shipElement = shipRef.current as HTMLDivElement;
        const { top, left } = shipElement.getBoundingClientRect();
        let pageX = 0;
        let pageY = 0;

        if (event.nativeEvent instanceof MouseEvent) {
            pageX = event.nativeEvent.pageX;
            pageY = event.nativeEvent.pageY;
        }
        if (event.nativeEvent instanceof TouchEvent) {
            pageX = event.nativeEvent.touches[0].pageX;
            pageY = event.nativeEvent.touches[0].pageY;
        }
        const shiftX = pageX - left;
        const shiftY = pageY - top - window.scrollY;
        setMouseShifts({ shiftX, shiftY });
        setIsDraggable(true);

    } : undefined;

    const onMouseUpHandler = !isGameStarted ? (event: TouchOrClickEvent) => {
        setIsDraggable(false);
        //if ship is placed on board then mouse up  should  rotate it
        if (isPositionOnBoardConfirmed) {
            //if ship size equlas 1 rotating doesnt have sense
            if (shipSize != 1) {
                //check if ship is placed close to border. If it rotated we should check left border, if not then check bottom
                let [x, y] = isRotated ?
                    [shipCoordinates.x + shipBlockDimensions.width + shipBlockDimensions.width / 2, shipCoordinates.y + shipBlockDimensions.height / 2 - window.scrollY]
                    :
                    [shipCoordinates.x + shipBlockDimensions.width + shipBlockDimensions.width / 2, shipCoordinates.y + shipBlockDimensions.height + shipBlockDimensions.height / 2 - window.scrollY];

                const targetElement = document.elementFromPoint(x, y);
                if (targetElement?.tagName != "TD") return;

                //check if neighboring blocks in potenitally rotated position are not occupied by other ships.
                // also check if ship blocks dont extend out of border
                for (let offset = -1; offset < 2; offset++) {

                    for (let point = 2; point < shipSize + 1; point++) {
                        //if ship is rotated then check blocks on x line, if not then on y line
                        [x, y] = isRotated ?
                            [shipCoordinates.x + shipBlockDimensions.width * point + shipBlockDimensions.width / 2, shipCoordinates.y + shipBlockDimensions.height * offset + shipBlockDimensions.height / 2 - window.scrollY]
                            :
                            [shipCoordinates.x + shipBlockDimensions.width * offset + shipBlockDimensions.width / 2, shipCoordinates.y + shipBlockDimensions.height * point + shipBlockDimensions.height / 2 - window.scrollY];
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
            updateShip(id, { coordinates: { ...shipPlacements }, isRotated: isEditMode ? false : isRotated, boardSquaresIds: isEditMode ? [] : [...boardSquaresIds] })
            return;
        }
        //if is edit mode off then return ship to its last placement on board;
        if (!isEditMode) {
            updateShip(id, { placement: { ...shipCoordinates } });
        }

        const shipElement = shipRef.current as HTMLDivElement;

        shipElement.hidden = true;
        const td = document.elementFromPoint(shipCoordinates.x + shipBlockDimensions.width / 2, shipCoordinates.y + shipBlockDimensions.height / 2 - window.scrollY) as HTMLTableCellElement;
        const tr = td.parentNode as HTMLTableRowElement;
        const colId = Array.from(tr.children as HTMLCollection).indexOf(td) - 1;
        const rowId = Array.from(tr.parentNode?.children as HTMLCollection).indexOf(tr) - 1;
        shipElement.hidden = false;

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

        isTouchDevice
            ?
            <div ref={shipRef} onTouchStart={onMouseDownHandler} onTouchEnd={onMouseUpHandler} className={classes.join(" ")} style={{ width: + shipDimensions.width + "px", height: shipDimensions.height + "px", top: shipCoordinates.y, left: shipCoordinates.x }}>
            </div>
            :
            <div ref={shipRef} onMouseDown={onMouseDownHandler} onMouseUp={onMouseUpHandler} className={classes.join(" ")} style={{ width: shipDimensions.width + "px", height: shipDimensions.height + "px", top: shipCoordinates.y, left: shipCoordinates.x }}>
            </div>
    )
}
