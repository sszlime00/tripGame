import { Application, Container, Ticker } from "pixi.js";
import * as Tweedle from 'tweedle.js';
import GameBackground from "./components/Background";
import { IScene } from "./scripts/types";

export const SCREEN_WIDTH = document.documentElement.clientWidth;
export const SCREEN_HEIGHT = document.documentElement.clientHeight;

export class Administer {
  private constructor() { }
  private static app: Application;
  private static currentScene: IScene;

  public static background: GameBackground;

  public static get scene(): IScene {
    return Administer.currentScene;
  }

  public static get stage(): Container {
    return Administer.app.stage;
  }

  public static async initialize(): Promise<Application> {
    Administer.app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 'white',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    Administer.app.ticker.minFPS = 60;
    Administer.app.ticker.maxFPS = 60;
    // Administer.app.ticker.add(Administer.update);
    Administer.app.ticker.add(() => Tweedle.Group.shared.update(Ticker.shared.elapsedMS), this);
    Administer.background = await GameBackground.makeBackground();
    Administer.app.stage.addChild(this.background);
    return Administer.app;
  }

  public static async changeScene(newScene: IScene): Promise<void> {
    if (Administer.currentScene) {
      await Administer.currentScene.onLeave();
      Administer.app.stage.removeChild(Administer.currentScene);
      Administer.currentScene.destroy();
    }
    Administer.currentScene = newScene;
    Administer.app.stage.addChild(Administer.currentScene);
    await Administer.currentScene.onEnter();
  }

  public static getApp(): Application {
    return Administer.app;
  }

  private static update(delta: number): void {
    if (Administer.currentScene) Administer.currentScene.update(delta);
  }
}
