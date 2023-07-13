import BoardSquareState from "../types/BoardSquareState";

export default function isShipDestroyed(boardSquares:BoardSquareState[],shipBoardSquaresIds: number[], boardSquareId:number){
    const shipBoardSquares = boardSquares.filter(boardSquare=>shipBoardSquaresIds.includes(boardSquare.id));

    for (const boardSquare of shipBoardSquares) {
        if(boardSquare.id == boardSquareId) continue;

        if(boardSquare.status == "default") return false;
    }

    return true;
}