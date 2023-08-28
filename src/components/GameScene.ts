import { Color, Container, Text, TextStyle, TEXT_GRADIENT } from "pixi.js";
import { SCREEN_WIDTH } from "../Administer";
import { UIGroup, bounceComponent } from "../scripts/animationHandler";
import { GameFont } from "../scripts/assetLoad";
import { SCREEN_WIDTH, SCREEN_Height } from '../Page/Game'

export default class GameUI extends Container {
  private readonly timerColor = new Color('#FFFFFF');
  private readonly timerCriticalColor = new Color('#e35a5a');

  private readonly targetScore: number;

  public readonly scoreValueLabel: Text;
  private readonly scoreLabel: Text;
  private readonly targetLabel: Text;
  private readonly timerLabel: Text;
  private readonly timerValueLabel: Text;

  private onTimeEnd: () => void;

  private _score = 0;

  private _time = 0;

  public get score(): number {
    return this._score;
  }

  public set score(val: number) {
    this._score = val;
    this.scoreValueLabel.text = `${val}`;
    UIGroup.removeAll();
    bounceComponent(this.scoreValueLabel, 1.1, 300, 1, UIGroup);
  }

  // public get time(): number {
  //   return this._time;
  // }

  // public set time(val: number) {
  //   this._time = val;
  //   if (val <= 0) {
  //     this.onTimeEnd();
  //     this._time = 0;
  //   }
  //   const minutes = Math.floor(this._time / 60).toString().padStart(2, '0');
  //   const seconds = Math.floor(this._time % 60).toString().padStart(2, '0');
  //   this.timerValueLabel.text = `${minutes}:${seconds}`;
  //   this.timerValueLabel.tint = val <= 10 ? this.timerCriticalColor : this.timerColor;
  // }

  constructor(startingTime: number, targetScore: number, onTimeEnd: () => void) {
    super();
    this._time = startingTime;
    this.targetScore = targetScore;
    this.onTimeEnd = onTimeEnd;
    this.scoreLabel = this.makeLabel('SCORE', 22, 10);
    this.scoreValueLabel = this.makeLabel('0', 30, 30);
    this.targetLabel = this.makeLabel(`TARGET: ${targetScore}`, 20, 70);
    // this.timerLabel = this.makeLabel('TIME', 22, 90);
    // this.timerValueLabel = this.makeLabel('00:00', 30, 110);
  }
  private makeLabel(content: string, fontSize: number, y: number): Text {
    const text = new Text(content, new TextStyle({
      fontFamily: GameFont.Poppins,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 5,
      fontSize,
    }));
    text.x = SCREEN_WIDTH - 135;
    text.y = y;
    if(SCREEN_WIDTH < 500) {
      text.scale.x = 0.6; 
      text.scale.y = 0.6;
    } 
    console.log('创建了text~~~~~~~~~~~~~~~~~~~S');
    
    this.addChild(text);
    return text;
  }
}