import { Color, Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Administer";
import { bounceComponent, fadeComponent } from "../scripts/animationHandler";
import { GameFont } from "../scripts/assetLoad";
import ButtonComponent from "./general/ButtonComponent";

export default class GameOver extends Container {
  private readonly blackLayer: Sprite;

  private readonly title: Text;

  private readonly message: Text;

  private readonly score: Text;


  constructor(onClick: () => void) {
    super();
    this.blackLayer = this.makeBlackLayer();
    this.message = this.makeMessage();
    this.score = this.makeScore();
    this.addChild(this.blackLayer);
    this.addChild(this.message);
    this.addChild(this.score);
  }

  public show(win: boolean, score: number, duration = 1000): void {
    this.message.text = win ? 'YOU WON' : 'TIME IS OVER';
    this.score.text = `${score}`;
    fadeComponent(this, duration, 1);
  }

  private makeBlackLayer(): Sprite {
    const blackLayer = new Sprite(Texture.WHITE);
    blackLayer.tint = 'black';
    blackLayer.width = SCREEN_WIDTH;
    blackLayer.height = SCREEN_HEIGHT;
    blackLayer.alpha = 0.7;
    return blackLayer;
  }


  private makeMessage(): Text {
    const message = new Text('YOU WON', new TextStyle({
      fontFamily: 'Microsoft JhengHei',
      fill: ["#ffff"],
      fontSize: 50,
      stroke: "#0000FF",
      strokeThickness: 10,
      fontWeight: 'bold',
    }));
    message.anchor.set(0.5);
    message.x = SCREEN_WIDTH / 2;
    message.y = SCREEN_HEIGHT / 2 - 70;
    return message;
  }

  private makeScore(): Text {
    const message = new Text('', new TextStyle({
      fontFamily: GameFont.Poppins,
      fill: 'white',
      fontSize: 90,
      stroke: "black",
      strokeThickness: 5,
      fontWeight: 'bold',
    }));
    message.anchor.set(0.5);
    message.x = SCREEN_WIDTH / 2;
    message.y = SCREEN_HEIGHT / 2;
    return message;
  }
}