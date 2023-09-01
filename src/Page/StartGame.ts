import { Assets, Color, Container, Text, TextStyle } from "pixi.js";
import { Administer, SCREEN_HEIGHT, SCREEN_WIDTH } from "../Administer";
import ButtonComponent from "../components/general/ButtonComponent";
import { GameAssets, GameFont } from "../scripts/assetLoad";
import { IScene } from "../scripts/types";
import { Spine } from 'pixi-spine';
import { Game } from "./Game";
import { GameRules } from '../scripts/types'
import { Easing, Tween } from "tweedle.js";
import { animateTitleDown } from '../scripts/animationHandler'
import { Howl } from 'howler';
import { music } from "../components/general/AudioAssets";


export class StartGame extends Container implements IScene {
  private title;
  private playButton: ButtonComponent;
  private initialRules: GameRules = {
    limitScore: 150,
    limitTime: 60,
  }

  constructor(music: Howl, rule?: GameRules) {
    super();
  
    music.stop()
    
    music.play();
    
    this.title = this.makeTitle();
    this.playButton = this.makePlayButton();
    this.initialRules = rule || this.initialRules;
    this.playButton.on('click', this.onPlayClicked, this);
     
    
  }


  public async onEnter(): Promise<void> {
    await this.playIntroTween();
  }

  public async onLeave(): Promise<void> {
  }

  public update(): void {

  }
  private onPlayClicked(): void {

    console.log('click')

    Administer.changeScene(new Game(this.initialRules))

  }

  private makeTitle() {
    const text = new Text('Match Game', new TextStyle({
      fontFamily: GameFont.Poppins,
      fontSize: 50,
      fill: '#C38ACC',
      stroke: 'white',
      strokeThickness: 5,
      align: "center",
    }));
    text.anchor.set(0.5);
    text.x = SCREEN_WIDTH / 2 ;
    text.y = 0;
    this.addChild(text);
    animateTitleDown(text);
    return text;
  }
  private makePlayButton(): ButtonComponent {
    const btn = new ButtonComponent({
      text: 'PLAY',
      width: 130,
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
    this.addChild(btn);
    return btn;
  }
  private playIntroTween(): Promise<void> {
    return new Promise<void>((resolve) => {
      const y = this.playButton.y;
      this.playButton.y = 1000;
      new Tween(this.playButton)
        .to({ y }, 300)
        .easing(Easing.Cubic.Out)
        .onComplete(() => resolve())
        .start();
    });
  }

}
