import { Point } from "pixi.js";
import { SYMBOL_SIZE } from "../../scripts/board/boardHandler";
import { SymbolID } from "../../scripts/types";
import SymbolComponent from "./SymbolComponent";

export default class SymbolPool {
    private symbols: SymbolComponent[] = [];

    constructor(initialCapacity: number) {
        this.initializePool(initialCapacity);
    }
    private initializePool(capacity: number) {
        for(let i = 0; i < capacity; i++) {
            const symbol = new SymbolComponent(SymbolID.Empty, SYMBOL_SIZE, new Point(0,0));
            this.symbols.push(symbol);
        }
    }
    public getSymbol(symbolID: SymbolID, boardPos: Point): SymbolComponent | null {
        if (this.symbols.length === 0) {
          return null; 
        }
        
        const symbol = this.symbols.pop();
        symbol.symbolID = symbolID;
        symbol.boardPos = boardPos;
        return symbol;
      }
      public returnSymbol(symbol: SymbolComponent) {
        this.symbols.push(symbol);
      }
}