import { Point } from "pixi.js";
import { BoardMatrix, GameCombination, SymbolID } from "../types";
import { copyBoard } from "./boardHandler";

function includesPoint(arr: Array<Point>, { x, y }: Point): boolean {
  return arr.find((p: Point) => p.x === x && p.y === y) !== undefined;
}

// function uniqueAdd(arr: Array<Point>, values: Array<Point>): void {
//   values.forEach((point) => {
//     if (!includesPoint(arr, point)) arr.push(point);
//   });
// }
function uniqueAdd(arr: Array<Point>, values: Array<Point>): void {
  values.forEach((point) => {
    if (!includesPoint(arr, point)) arr.push(point);
  });
}

function getSymbolOn(board: BoardMatrix, { x, y }: Point): number | null {
  if (x < 0 || x >= board.length) return null;
  if (y < 0 || y >= board.length) return null;
  return board[y][x];
}

// function findAdjacents(board: BoardMatrix, adjacents: Array<Point>, p: Point): Array<Point> {
//   const sb = getSymbolOn(board, p);
//   const testAdjacent = (x: number, y: number) => getSymbolOn(board, new Point(x, y)) === sb && !includesPoint(adjacents, new Point(x, y)) && adjacents.length < 4;
//   uniqueAdd(adjacents, [p]);
//   if (testAdjacent(p.x + 1, p.y)) findAdjacents(board, adjacents, new Point(p.x + 1, p.y));
//   if (testAdjacent(p.x - 1, p.y)) findAdjacents(board, adjacents, new Point(p.x - 1, p.y));
//   if (testAdjacent(p.x, p.y + 1)) findAdjacents(board, adjacents, new Point(p.x, p.y + 1));
//   if (testAdjacent(p.x, p.y - 1)) findAdjacents(board, adjacents, new Point(p.x, p.y - 1));
  
 
//   return adjacents;
// }
function findAdjacents(board: BoardMatrix, adjacents: Array<Point>, p: Point): Array<Point> {
  const sb = getSymbolOn(board, p);
  uniqueAdd(adjacents, [p]);

  const directions = [
    { x: 1, y: 0 }, // Right
    { x: -1, y: 0 }, // Left
    { x: 0, y: 1 }, // Down
    { x: 0, y: -1 }, // Up
  ];

  for (const dir of directions) {
    const newX = p.x + dir.x;
    const newY = p.y + dir.y;

    if (getSymbolOn(board, new Point(newX, newY)) === sb) {
      const newPoint = new Point(newX, newY);
      if (!includesPoint(adjacents, newPoint)) {
        findAdjacents(board, adjacents, newPoint);
      }
    }
  }

  return adjacents;
}

function isSameSymbol(board, x, y, value) : boolean{
  if (x < 0 || x >= board.length || y < 0 || y >= board.length) {
    return false; // 坐标越界
  }
  const element = getSymbolOn(board, new Point(x, y));
  return element === value;
}

export function getCombinationsInBoard(board: BoardMatrix, match = 3): Array<GameCombination> {
  const combs: Array<GameCombination> = [];
  const combPoints: Array<Point> = [];
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length; x++) {
      const adjcs = findAdjacents(board, [], new Point(x, y));
      if (!includesPoint(combPoints, new Point(x, y))) {
        if (adjcs.length >= match) {
          combs.push(adjcs);
          combPoints.push(...adjcs);
        }
      }
    }
  }
  return combs;
}


export function removeCombinationsFromBoard(board: BoardMatrix, combinations: Array<GameCombination>): BoardMatrix {
  const auxBoard = copyBoard(board);
  combinations.forEach((points) =>
    points.forEach(({ x, y }) => {
      auxBoard[y][x] = SymbolID.Empty;
    })
  );
  return auxBoard;
}

export function getCombinationScore(combination: GameCombination): number {
  const { length } = combination;
  if (length > 10) return length * 8;
  if (length > 5) return length * 5;
  return length * 2;
}
