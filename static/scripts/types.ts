import { DisplayObject, Point } from "pixi.js";

export interface IScene extends DisplayObject {
  update(delta: number): void;

  onEnter(): Promise<void>;

  onLeave(): Promise<void>;
}

export enum SymbolID {
  Empty = -1,
  Zombie = 0,
  Brain = 1,
  Skull = 2,
  Goblin = 3,
  Eyes = 4,
}

export enum Direction {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}

export type BoardMatrix = Array<Array<SymbolID>>;

export type GameCombination = Array<Point>;

export type SymbolDrop = {
  point: Point;
  newPoint: Point;
}

export type GameAction = {
  point: Point;
  direction: Direction;
}

export type GameRules = {
  limitScore: number;
  limitTime: number;
}
