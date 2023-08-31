import { AnimatedSprite, Assets, Container, Point, Spritesheet } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { GameAssets } from "../../scripts/assetLoad";
import { SYMBOL_MARGIN, SYMBOL_SIZE } from "../../scripts/board/boardHandler";

export default class ExplosionComponent extends AnimatedSprite {
  static explosionFX({ x, y }: Point, parent: Container, delay = 300): ExplosionComponent {
    const textures = Object.values((Assets.get(GameAssets.explosion) as Spritesheet).textures);
    const explosion = new ExplosionComponent(textures);
    const size = SYMBOL_SIZE+SYMBOL_MARGIN;
    const finalSize = size+50;
    const finalX = x - size / 2;
    const finalY = (y - size / 2) - 5;
    explosion.x = finalX;
    explosion.y = finalY;
    explosion.width = size;
    explosion.height = size;
    parent.addChild(explosion);
    new Tween(explosion)
      .delay(100)
      .to({ width: finalSize, height: finalSize, alpha: 0, x: finalX - 25, y: finalY - 25 }, 50)
      .easing(Easing.Quartic.Out)
      .onComplete(() => explosion?.destroy())
      .start();
    explosion.animationSpeed = 0.1;
    explosion.play();
    return explosion;
  }
}