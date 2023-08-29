import { Point } from "pixi.js";
import { BoardMatrix, SymbolDrop, SymbolID } from "../types";
import { getCombinationsInBoard } from "./combinationHandler";
import { getBoardValidActions } from "./actionHandler";
import { rangeArray } from "../utils";

export const SYMBOL_SIZE = 60;

export const SYMBOL_MARGIN = 2;

export const BOARD_SIZE = 6;

// const InitialBoard = [
//   [1, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 1, 1, 1],
//   [0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 1],
//   [0, 0, 0, 0, 0, 0, 0, 1],
//   [0, 0, 0, 0, 0, 0, 0, 1],
// ]

const InitialBoard = [
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0],
]

function getRandomSymbolID(): SymbolID {
  const rand = Math.floor(Math.random() * 5);
  return rand;
}

export function copyBoard(board: BoardMatrix): BoardMatrix {
  return [...board.map((arr) => [...arr])];
}

 
function removeBoardCombinations(board: BoardMatrix): BoardMatrix {
  const auxBoard = copyBoard(board);
  const combinations = getCombinationsInBoard(auxBoard);
  combinations.forEach((points) => {
    const { x, y } = points[1];
    const symbol = auxBoard[y][x];
    const adjTop = auxBoard[Math.max(y - 1, 0) % 5][x];
    const adjBottom = auxBoard[Math.max(y + 1, 0) % 5][x];
    const adjLeft = auxBoard[y][Math.max(x - 1, 0) % 5];
    const adjRight = auxBoard[y][Math.max(x + 1, 0) % 5];
    const options = [0, 1, 2, 3, 4].filter((sb) => sb !== symbol && sb !== adjTop && sb !== adjBottom && sb !== adjLeft && sb !== adjRight);
    auxBoard[y][x] = options[0];
  });
  if (getCombinationsInBoard(auxBoard).length > 0) return removeBoardCombinations(auxBoard);
  return auxBoard;
}

function makeRandomBoard(): BoardMatrix {
  return InitialBoard.map((row) => row.map((_) => getRandomSymbolID()));
}

function replaceEmptyByRandom(board: BoardMatrix): BoardMatrix {
  return copyBoard(board.map((row) => row.map((symbol) => symbol === SymbolID.Empty ? getRandomSymbolID() : symbol)));
}

export function makeFirstBoard(): BoardMatrix {
  const randBoard = makeRandomBoard();
  const cleanBoard = removeBoardCombinations(randBoard);
  return cleanBoard;
}

export function findGravityDrops(column: Array<number>, x: number): Array<SymbolDrop> {
    const aux = [...column];
    const drops: Array<SymbolDrop> = [];
    let height = 0;
    for (let y = column.length - 1; y > -1; y--) {
      const point = new Point(x, y);
      const symbol = aux[y];
      if (symbol === SymbolID.Empty) height += 1;
      else if (height > 0) {
        const newPoint = new Point(x, y + height)
        drops.push({ point, newPoint });
      }
    }
    return drops;
}

// 对每一列的symbol进行处理，如果id为-1则删除并在这一列的开头添加-1
function applyColumnGravity(column: Array<number>): { column: Array<number>, height: number } {
  const aux = [...column];
  let height = 0;
  for (let i = 0; i < column.length; i++) {
    const sb = aux[i];
    if (sb === -1) {
      height += 1;
      aux.splice(i, 1);
      aux.unshift(-1);
    }
  }
  return { column: aux, height };
}


export function applyBoardGravity(board: BoardMatrix): BoardMatrix {
  const indexes = rangeArray(0, board.length - 1);
  const newSymbols: Array<Point> = [];
  const auxBoard = copyBoard(board);
  const heightByColumn = [];
  for (let c = 0; c < board.length; c++) {
    const originalColumn = indexes.map((r) => board[r][c]);
    const { column, height } = applyColumnGravity(originalColumn);
    indexes.forEach((r) => {
      auxBoard[r][c] = column[r];
      newSymbols.push(new Point(r, c));
    });
    heightByColumn.push(height);
  }
  let finalBoard = replaceEmptyByRandom(auxBoard);
  while (getBoardValidActions(finalBoard).length <= 0)
    finalBoard = replaceEmptyByRandom(auxBoard);
  return finalBoard;
}

export function isAdjacent(point1: Point, point2: Point): boolean {
  const dX = Math.abs(point1.x - point2.x);
  const dY = Math.abs(point1.y - point2.y);
  return dX + dY <= 1;
}
