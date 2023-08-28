import { Container, DisplayObject, IPointData, Point, Text } from 'pixi.js';
import { Easing, EasingFunction, Group, Tween } from 'tweedle.js';

import SymbolComponent from "../components/general/SymbolComponent";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Administer';

export const BoardGroup = new Group();
export const UIGroup = new Group();


type MoveParams = {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
}

const DefaultMoveParam = { duration: 250, delay: 0, easing: Easing.Quadratic.InOut };

export function animateSymbolToPosition(symbol: SymbolComponent, position: Point, params?: MoveParams): Promise<void> {
  const { duration, delay, easing } = { ...DefaultMoveParam, ...params };
  console.log('animateSymbolToPosition!!!');
  
  return new Promise<void>((resolve) => {
    symbol.alpha = 1;
    new Tween(symbol)
      .to({ x: position.x, y: position.y }, duration)
      .easing(easing)
      .onComplete(() => setTimeout(resolve, delay))
      .start()
  });
}

export async function animateSymbolSwap(origin: SymbolComponent, target: SymbolComponent, params?: MoveParams): Promise<void> {
  const originPosition = new Point(origin.x, origin.y);
  const targetPosition = new Point(target.x, target.y);
  await Promise.all([
    animateSymbolToPosition(origin, targetPosition, params),
    animateSymbolToPosition(target, originPosition, params)
  ]);
}
export function animateSymbolExplode(symbol: SymbolComponent): Promise<void> {
  return new Promise<void>((resolve) =>
    new Tween(symbol)
      .to({ scale: 4, alpha: 0 }, 100)
      .easing(Easing.Quadratic.Out)
      .onComplete(() => {
        setTimeout(() => {
          resolve(); // 在间隔时间后解决 Promise
        }, 30)})
      .start()
  );
}

export function animateTitleDown(text: Text): Promise<void> {
  return new Promise<void>((resolve) => 
    new Tween(text)
      .to({x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 - text.height}, 300)
      .easing(Easing.Cubic.Out)
      .onComplete(() => resolve())
      .start()
  )
}

export function animateScoreFeedback(
  text: Text,
  score: number,
  point: Point,
  delay: number,
  onReach?: () => void
): Promise<void> {
  const { x, y } = point;
  const middle = text.parent.toLocal(new Point((SCREEN_WIDTH / 2) - text.width / 2, (SCREEN_HEIGHT / 2) - text.height / 2));
  const targetScale = score > 20 ? 2.5 : 2;
  return new Promise<void>((resolve) => {
    text.scale.set(0.5, 0.5);
    text.alpha = 0.5;
    const goToCenter = new Tween(text)
      .to({ x: middle.x, y: middle.y, scale: { x: targetScale, y: targetScale }, alpha: 1 }, 200)
      .easing(Easing.Sinusoidal.InOut);
    const disappear = new Tween(text)
      .to({ scale: { x: 2, y: 3 }, alpha: 0 }, 200)
      .easing(Easing.Cubic.Out)
      .onComplete(() => resolve());
    const move = new Tween(text)
      .delay(250)
      .to({ x, y, scale: { x: 1, y: 1 } }, 300)
      .easing(Easing.Quadratic.In)
      .chain(disappear)
      .onComplete(onReach);
    setTimeout(() => move.start(), delay);
  });
}

export function animateBoardImpact(container: Container, delay: number, force = 10): Promise<void> {
  const initialY = container.y;
  BoardGroup.removeAll();
  return new Promise<void>((resolve) => {
    const down = new Tween(container, BoardGroup)
      .delay(delay)
      .to({ y: initialY + force }, 100)
      .easing(Easing.Quadratic.Out);
    const up = new Tween(container, BoardGroup)
      .to({ y: initialY }, 100)
      .easing(Easing.Quadratic.Out)
      .onComplete(() => resolve());
    down.chain(up).start();
  });
}

export function fadeComponent(object: DisplayObject, duration: number, alpha = 1): Promise<void> {
  return new Promise<void>((resolve) =>
    new Tween(object)
      .to({ alpha }, duration)
      .onComplete(() => resolve())
      .start()
  );
}

export async function bounceComponent(
  object: DisplayObject,
  scale: number | IPointData,
  duration: number,
  repeat = 1,
  group = Group.shared,
): Promise<void> {
  const x = typeof scale === 'number' ? scale : scale.x;
  const y = typeof scale === 'number' ? scale : scale.y;
  new Tween(object, group)
    .to({ scale: { x, y } }, duration)
    .easing(Easing.Cubic.InOut)
    .yoyo(true)
    .repeat(repeat)
    .start();
}