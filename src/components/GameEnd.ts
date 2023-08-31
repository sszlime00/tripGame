import { Color, Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Administer";
import { bounceComponent, fadeComponent } from "../scripts/animationHandler";
import { GameFont } from "../scripts/assetLoad";
import { Administer, SCREEN_HEIGHT, SCREEN_WIDTH } from "../Administer";
import ButtonComponent from "../components/general/ButtonComponent";
import { Game } from '../Page/Game';
import { GameRules } from '../scripts/types'
import { StartGame } from "../Page/StartGame";
import { Howl } from 'howler';
import { music } from "./general/AudioAssets";

export default class GameOver extends Container {
  private readonly blackLayer: Sprite;

  private readonly title: Text;

  private readonly message: Text;
  private readonly playButton: ButtonComponent;


  private readonly score: Text;
  private initialRules: GameRules = {
    limitScore: 10,
    limitTime: 60,
  }


  constructor(onClick: () => void) {
    super();
    this.message = this.makeMessage();
    this.score = this.makeScore();
    this.playButton = this.makePlayButton();
    this.playButton.on('click', this.onPlayClicked, this);
    this.blackLayer = this.makeBlackLayer();
    this.addChild(this.blackLayer);
    this.addChild(this.message);
    this.addChild(this.score);
    this.addChild(this.playButton);
    
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
      fontFamily: GameFont.Poppins,
      fontSize: 65,
      fill: '#C38ACC',
      stroke: 'white',
      strokeThickness: 5,
      align: "center",
    }));
    message.anchor.set(0.5);
    message.x = SCREEN_WIDTH / 2;
    message.y = SCREEN_HEIGHT / 2 - 70;
    return message;
  }

  private makeScore(): Text {
    const message = new Text('', new TextStyle({
      fontFamily: GameFont.Poppins,
      fontSize: 65,
      fill: '#C38ACC',
      stroke: 'white',
      strokeThickness: 5,
      align: "center",
    }));
    message.anchor.set(0.5);
    message.x = SCREEN_WIDTH / 2;
    message.y = SCREEN_HEIGHT / 2;
    return message;
  }
  private makePlayButton(): ButtonComponent {
    const btn = new ButtonComponent({
      text: 'PLAY   AGAIN',
      width: 200,
      height: 60,
      tint: new Color('#FFFFFF'),
      hoverTint: new Color('#dcdcdc'),
      textStyle: new TextStyle({
        fontFamily: GameFont.Poppins,
        fill: "#000000",
        fontSize: 20,
      }),
      borders: ButtonComponent.borders(3, 3)
    });
    btn.x = SCREEN_WIDTH / 2 - btn.width / 2;
    btn.y = SCREEN_HEIGHT - 130;
    return btn;
  }
  private onPlayClicked(): void {
     Administer.changeScene(new StartGame(music))
  }
}