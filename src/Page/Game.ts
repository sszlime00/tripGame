import { Container, Point, Text, TextStyle, Ticker, Graphics } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { Administer, SCREEN_HEIGHT, SCREEN_WIDTH } from "../Administer";
import GameOver from "../components/GameEnd";
import GameUI from "../components/GameScene";
import SymbolComponent from "../components/general/SymbolComponent";
import SymbolPool from '../components/general/SymbolPool'
import { BoardGroup, UIGroup ,animateBoardImpact, animateScoreFeedback, animateSymbolExplode, animateSymbolSwap, animateSymbolToPosition, fadeComponent } from "../scripts/animationHandler";
import { GameFont } from "../scripts/assetLoad";
import { applyActionOnBoard, createAction, getActionHash, getActionTargetPoint, getBoardValidActions } from "../scripts/board/actionHandler";
import { BOARD_SIZE, SYMBOL_MARGIN, SYMBOL_SIZE, applyBoardGravity, copyBoard, findGravityDrops, isAdjacent, makeFirstBoard } from "../scripts/board/boardHandler";
import { getCombinationScore, getCombinationsInBoard, removeCombinationsFromBoard } from "../scripts/board/combinationHandler";
import { BoardMatrix, GameAction, GameCombination, GameRules, IScene, SymbolID } from "../scripts/types";
import { rangeArray } from "../scripts/utils";

export class GameScene extends Container implements IScene {
  private readonly rules: GameRules;

  private board: BoardMatrix = [];

  private validActions: Array<number> = [];

  private boardContainer: Container;

  private refillSymbols: Record<number, Array<SymbolComponent>> = {};

  private tappedSymbol: SymbolComponent | null = null;

  private targetSymbol: SymbolComponent | null = null;


  private symbols: Array<SymbolComponent> = [];
  private symbolPool: SymbolPool;


  private _processing = false;
  private _overing = false;

  private isGameOver = false;

  private hasWon = false;

  private get processing(): boolean {
    return this._processing;
  }

  private set processing(val: boolean) {
    this._processing = val;
    this.symbols.forEach((sb) => {
      sb.eventMode = val ? 'none' : 'static';
    });
  }

  private get overing(): boolean {
    return this._overing;
  }

  private set overing(val: boolean) {
    this._overing = val;
  }

  constructor(rules: GameRules) {
    super();
    this.rules = rules;
    this.overing = false;
    this.gameOver = new GameOver(this.startNewGame.bind(this));
    this.ui = new GameUI(rules.limitTime, rules.limitScore, this.onTimerEnded.bind(this));
    this.symbolPool = new SymbolPool(36);
    this.board = makeFirstBoard();
    this.boardContainer = this.createBoardContainer();
    if(SCREEN_WIDTH < 500) {
      this.boardContainer.scale = { x: 0.8, y: 0.9};
    } else {
      this.boardContainer.scale = { x: 1.3, y: 1.3 };
    }
    this.addChild(this.boardContainer);
    this.addChild(this.ui);
    this.calculateValidActions();
    Ticker.shared.add(this.update, this);
    this.processing = false;
  }

  public async onEnter(): Promise<void> {
    // 
  }

  public async onLeave(): Promise<void> {

  }

  public update(): void {
    // if (this.isGameOver === false) this.ui.time -= Ticker.shared.elapsedMS / 2000.0;
    // if( this.ui.time == 0) {
    //   this.overing = true;
    // }
  }

  private startNewGame(): void {
    console.log('要开始新游戏啦');
  }
  private processGameOver(won: boolean): void {
    this.hasWon = won;
    this.processing = true;
    this.isGameOver = true;
    this.addChild(this.gameOver);
    this.gameOver.alpha = 0;
    this.gameOver.show(won, this.ui.score);
  }


  // 处理行为 首先判断行为是否有效，有效则应用于board上,并且获取匹配项，清除匹配项
  private async processAction(action: GameAction): Promise<void> {
    console.log('this.over:????????', this.overing);
    
    this.processing = true;
    const targetPoint = getActionTargetPoint(action);
    const symbol = this.getSymbolOnPoint(action.point);
    const targetSymbol = this.getSymbolOnPoint(targetPoint);
    const isValid = this.validActions.includes(getActionHash(action))
    if (isValid && symbol && targetSymbol) {
      this.board = applyActionOnBoard(this.board, action);
      await animateSymbolSwap(symbol, targetSymbol);
      symbol.boardPos = targetSymbol.boardPos;
      targetSymbol.boardPos = action.point;
      const combinations = getCombinationsInBoard(this.board);
      await this.processCombinations(combinations);
      this.calculateValidActions();
    } else {
      await animateSymbolSwap(symbol, targetSymbol);
      await animateSymbolSwap(targetSymbol, symbol);
    }
    if (this.ui.score >= this.rules.limitScore) this.processGameOver(true);
    else if (this.isGameOver === true) this.processGameOver(false);
    else this.processing = false;
  }

  private async processSymbolRefill(): Promise<void> {
    await Promise.all(Object.entries(this.refillSymbols).map(([x, symbolList]) =>
      
      Promise.all(rangeArray(symbolList.length - 1, 0, -1).map(async (y) => {
        
        
        const symbol = symbolList[y];
        const point = new Point(+x, y);
        
        const position = this.getPositionForPoint(point);
        symbol.boardPos = new Point(symbol.boardPos.x, 0 - symbolList.length + y);
        symbol.symbolID = this.board[y][+x];
        // symbol.boardPos = new Point(symbol.boardPos.x, 0 - symbolList.length + y);
        // symbol.symbolID = this.board[y][+x];
        // animateBoardImpact(this.boardContainer, 650);
        await animateSymbolToPosition(symbol, position, { easing: Easing.Quartic.In });
        symbol.boardPos = point;
        this.symbolPool.returnSymbol(symbol);
      }))
    ));
    this.refillSymbols = {};
  }

  // private async processSymbolRefill(): Promise<void> {
  //   const refillPromises: Promise<void>[] = [];
  
  //   for (const [x, symbolList] of Object.entries(this.refillSymbols)) {
  //     for (let y = symbolList.length - 1; y >= 0; y--) {
  //       const symbol = symbolList[y];
  //       const point = new Point(+x, y);
  //       const position = this.getPositionForPoint(point);
        
  //       const animationPromise = animateSymbolToPosition(symbol, position, { easing: Easing.Quartic.In });
  //       const returnPromise = animationPromise.then(() => {
  //         symbol.boardPos = point;
  //         this.symbolPool.returnSymbol(symbol);
  //       });
        
  //       refillPromises.push(returnPromise);
  //     }
  //   }
  
  //   await Promise.all(refillPromises);
  //   this.refillSymbols = {};
  // }
  

  // 处理匹配，清理匹配项，开启动画，更新board,抽递归调用处理匹配项
  private async processCombinations(combinations: Array<GameCombination>): Promise<void> {

    if (combinations.length <= 0) return;
    this.board = removeCombinationsFromBoard(this.board, combinations);
    const feedbackPromises = [];
    await Promise.all(combinations.map((combination, idx) => {
      feedbackPromises.push(this.showScoreFeedback(combination, idx));
      return Promise.all(combination.map(async (point) => {
        const symbol = this.getSymbolOnPoint(point);
        if (!symbol) return
        await animateSymbolExplode(symbol);
        
        this.addSymbolToRefill(symbol, new Point(point.x, -1))
      }))
    }));
    
    !this.overing && await this.processSymbolsFall();
    !this.overing && await this.processSymbolRefill();
    await Promise.all(feedbackPromises);
    this.updateSymbolsToBoardData();
    await this.processCombinations(getCombinationsInBoard(this.board));
  }

  // private async processCombinations(combinations: Array<GameCombination>): Promise<void> {
  //   if (combinations.length <= 0) return;
  
  //   this.board = removeCombinationsFromBoard(this.board, combinations);
  
  //   const feedbackPromises: Promise<void>[] = [];
  //   const fallAndRefillPromises: Promise<void>[] = [];
  
  //   for (const [idx, combination] of combinations.entries()) {
  //     feedbackPromises.push(this.showScoreFeedback(combination, idx));
  //     for (const point of combination) {
  //       const symbol = this.getSymbolOnPoint(point);
  //       if (!symbol) continue;
  //       await animateSymbolExplode(symbol);
  //       this.addSymbolToRefill(symbol, new Point(point.x, -1));
  //     }
  //   }
  
  //   if (!this.overing) {
  //     fallAndRefillPromises.push(this.processSymbolsFall());
  //     fallAndRefillPromises.push(this.processSymbolRefill());
  //   }
  
  //   await Promise.all([...feedbackPromises, ...fallAndRefillPromises]);
  
  //   this.updateSymbolsToBoardData();
  
  //   const newCombinations = getCombinationsInBoard(this.board);
  //   await this.processCombinations(newCombinations);
  // }
  

  private async processSymbolsFall(): Promise<void> {    
    const board = applyBoardGravity(this.board);
    const indexes = rangeArray(0, this.board.length - 1);
    const allDrops = [];
    for (let c = 0; c < this.board.length; c++) {
      const column = indexes.map((r) => this.board[r][c]);
      const drops = findGravityDrops(column, c);
      allDrops.push(...drops.map(async ({ point, newPoint }) => {
        const symbol = this.getSymbolOnPoint(point);
        if (!symbol) return;
        const pos = this.getPositionForPoint(newPoint);
        
        await animateSymbolToPosition(symbol, pos, { duration: 100, easing: Easing.Elastic.Out });
        symbol.boardPos = newPoint;
        symbol.symbolID = board[newPoint.y][newPoint.x];
      }));
    }
    await Promise.all(allDrops);
    this.board = copyBoard(board);    
  }


  private calculateValidActions(): void {
    const actions = getBoardValidActions(this.board);
    this.validActions = actions.map((action) => getActionHash(action));
  }


  private updateSymbolsToBoardData(): void {
    
    this.board.forEach((row, rowIdx) => row.forEach((sbID, colIdx) => {
      const point = new Point(colIdx, rowIdx);
      const symbol = this.getSymbolOnPoint(point);
      if (!symbol) return;
      symbol.boardPos = point;
      symbol.symbolID = sbID;
    }));
  }

  private getSymbolOnPoint({ x, y }: Point): SymbolComponent | undefined {
    return this.symbols.find((symbol) => symbol.boardPos.x === x && symbol.boardPos.y === y);
  }

  private getPositionForPoint({ x, y }: Point): Point {
    const size = SYMBOL_SIZE + SYMBOL_MARGIN;
    return new Point(x * size, y * size);
  }

  // 创建待填充的数组
  private addSymbolToRefill(symbol: SymbolComponent, point: Point): void {
    const { x } = symbol.boardPos;
    
    if(!this.refillSymbols[x]) this.refillSymbols[x] = [];
    this.refillSymbols[x].push(symbol);
    symbol.boardPos = point;
    symbol.symbolID = SymbolID.Empty;

    
  }



  private onSymbolTap(symbol: SymbolComponent): void {
    this.tappedSymbol = symbol;
  }

  private onSymbolEnter(symbol: SymbolComponent): void {
    if (!this.tappedSymbol) return;
    if (this.tappedSymbol !== symbol && isAdjacent(symbol.boardPos, this.tappedSymbol.boardPos))
      this.targetSymbol = symbol;
    else if (this.tappedSymbol === symbol)
      this.targetSymbol = null;
  }

  private onSymbolRelease(): void {
    if (this.tappedSymbol && this.targetSymbol) {
      const action = createAction(this.tappedSymbol.boardPos, this.targetSymbol.boardPos);
      this.processAction(action);
    }
    this.tappedSymbol = null;
    this.targetSymbol = null;
  }



  private updateSymbolInputFeedback(): void {
    this.symbols.forEach((sb) => {
      const isHighlighted = sb === this.tappedSymbol || sb === this.targetSymbol;
      sb.width = isHighlighted ? SYMBOL_SIZE + 5 : SYMBOL_SIZE;
      sb.height = isHighlighted ? SYMBOL_SIZE + 5 : SYMBOL_SIZE;
    });
  }

  private onTimerEnded(): void {
    this.overing = true;
    console.log('这里！：', this.overing);
    
    if (this.isGameOver === true) return;
    this.isGameOver = true;
    if (this.processing === false) this.processGameOver(false);
  }

  private createBoardContainer(): Container {
    const container = new Container();
    console.log('~~~SCREEN_HEIGHT  SCREEN_WIDTH：', SCREEN_HEIGHT, SCREEN_WIDTH);
    
    container.x = SCREEN_WIDTH / 2 + SYMBOL_SIZE/2;
    container.y = SCREEN_HEIGHT/ 2 + SYMBOL_SIZE;
    const gridGraphics = new Graphics();
    gridGraphics.lineStyle(3,  '#86522C', 1);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const symbolId = this.board[r][c];
        const boardPos = new Point(c, r);
        const symbol = this.makeSymbol(symbolId, SYMBOL_SIZE, boardPos);
        symbol.position = this.getPositionForPoint(new Point(c, r));
        this.symbols.push(symbol);
        container.addChild(symbol);
      }
    }
    for (let row = 0; row < BOARD_SIZE+1; row++) {
      gridGraphics.moveTo(0-(SYMBOL_SIZE/2), row * (SYMBOL_SIZE + SYMBOL_MARGIN)-(SYMBOL_SIZE/2));
      gridGraphics.lineTo(container.width-(SYMBOL_SIZE/2), row * (SYMBOL_SIZE + SYMBOL_MARGIN)-(SYMBOL_SIZE/2) );
    }
    for (let col = 0; col < BOARD_SIZE+1; col++) {
      gridGraphics.moveTo(col * (SYMBOL_SIZE + SYMBOL_MARGIN)-(SYMBOL_SIZE/2), 0-(SYMBOL_SIZE/2));
      gridGraphics.lineTo(col * (SYMBOL_SIZE + SYMBOL_MARGIN)-(SYMBOL_SIZE/2), container.height-(SYMBOL_SIZE/2));
    }
    container.addChild(gridGraphics);
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    return container;
  }

  private makeSymbol(symbolId: SymbolID, size: number, pos: Point): SymbolComponent {
    const symbol = this.symbolPool.getSymbol(symbolId, pos) || new SymbolComponent(symbolId, size, pos);
    // const symbol = new SymbolComponent(symbolId, size, pos);
    symbol.on('pointerdown', () => this.onSymbolTap(symbol));
    symbol.on('pointerenter', () => this.onSymbolEnter(symbol));
    symbol.on('pointerup', () => this.onSymbolRelease());
    symbol.on('pointerupoutside', () => this.onSymbolRelease());
    symbol.eventMode = this.processing ? 'none' : 'static';
    return symbol;
  }
  private async showScoreFeedback(combination: GameCombination, idx: number): Promise<void> {
    const { scoreValueLabel } = this.ui;
    const score = getCombinationScore(combination);
    const symbol = this.getSymbolOnPoint(combination[1]);
    if (!symbol) return;
    const text = new Text(`${score}`, new TextStyle({
      fontFamily: GameFont.Poppins,
      fontSize: 20,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 5,
      align: "center",
    }));
    text.anchor.set(0.5);
    const target = this.boardContainer.toLocal(scoreValueLabel.getGlobalPosition());
    const targetPosition = new Point(target.x, target.y + 25);
    text.x = target.x;
    text.y = target.y;
    this.boardContainer.addChild(text);
    // await animateScoreFeedback(text, score, targetPosition, 500 * idx, () => {
      this.ui.score += score;
    // });
    text.destroy();
  }

}