//should return indexes of board squares;
export default function generateBotShipsPlacements() {
  const occupiedCells: number[] = [];
  const availableCells = Array.from({ length: 100 }, (_, index) => index);

  function isBoardSquareOccupied(cell: number) {
    return occupiedCells.includes(cell);
  }
  function isNeighboringBoardSquaresOccupied(blockIndex:number, cellId:number, direction:string) {
    const rowIndex = Math.floor(cellId / 10); // Индекс строки клетки
    const colIndex = cellId % 10; // Индекс столбца клетки
  
    // Проверка соседних клеток в зависимости от индекса блока и направления
    if (blockIndex === 0) {
      // Проверяем все соседние клетки
      for (let i = Math.max(0, rowIndex - 1); i <= Math.min(9, rowIndex + 1); i++) {

        for (let j = Math.max(0, colIndex - 1); j <= Math.min(9, colIndex + 1); j++) {
          if (i !== rowIndex || j !== colIndex) {
            const neighborCellId = i * 10 + j; // Вычисляем индекс соседней клетки
            // Проверяем, занята ли соседняя клетка
            if (isBoardSquareOccupied(neighborCellId)) {
              return true; // Возвращаем true, если хотя бы одна соседняя клетка занята
            }
          }
        }
      }
    } else if (blockIndex > 0) {
      // Проверяем соседние клетки в зависимости от направления блока
      if (direction === 'horizontal') {
        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
          if (i >= 0 && i < 10) {
            const neighborCellId = i * 10 + colIndex + 1;
            if (isBoardSquareOccupied(neighborCellId)) {
              return true;
            }
          }
        }
      } else if (direction === 'vertical') {
        for (let i = colIndex -1; i <= colIndex + 1; i++) {
          if (i >= 0 && i < 10) {
            const neighborCellId = (rowIndex + 1)* 10 + i;
            if (isBoardSquareOccupied(neighborCellId)) {
              return true;
            }
          }
        }
      }
    }
  
    return false; // Если нет занятых соседних клеток, возвращаем false
  }
  function placeShip(shipSize: number) {
    const directions = ['vertical', 'horizontal'];
    const startCell = Math.floor(Math.random() * availableCells.length);
    const direction = directions[Math.floor(Math.random() * directions.length)];

    let validPlacement = true;
    const shipCells = [];

    if (direction === 'vertical') {
      for (let i = 0; i < shipSize; i++) {
        const cell = startCell + i * 10;
        if (isBoardSquareOccupied(cell)|| isNeighboringBoardSquaresOccupied(i,cell,direction) || !availableCells.includes(cell)) {
          validPlacement = false;
          break;
        }
        shipCells.push(cell);
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        const cell = startCell + i;
        if (isBoardSquareOccupied(cell) || isNeighboringBoardSquaresOccupied(i,cell,direction)  || !availableCells.includes(cell) || cell % 10 > 9 - shipSize) {
          validPlacement = false;
          break;
        }
        shipCells.push(cell);
      }
    }

    if (validPlacement) {
      occupiedCells.push(...shipCells);
    } else {
      placeShip(shipSize); // Try again with a new startCell
    }
  }

  function generateShips() {
    const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    ships.forEach((shipSize) => {
      placeShip(shipSize);
    });
  }

  generateShips();

  return occupiedCells;
}

