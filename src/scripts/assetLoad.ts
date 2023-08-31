import { Assets, ProgressCallback, Texture } from "pixi.js";
import { SymbolID } from "./types";
import { Howl } from 'howler';
import { music } from "../components/general/AudioAssets";

export enum GameFont {
  DirtyHarold = 'DirtyHarold',
  Poppins = 'Poppins Bold',
};

export const GameAssets = {
  mainAtlas: 'main.json',
  explosion: 'explosion.json',
  background: 'back.png',
  buttonBase: 'anniu.png',
  buttonBasePressed: 'anniu.png',
  music: 'music.mp3',
  fonts: [
    'fonts/DirtyHarold.woff2',
    'fonts/Poppins-Bold.ttf',
  ],
}

const SymbolAssetMap: Record<SymbolID, string> = {
  [SymbolID.Empty]: '',
  [SymbolID.Zombie]: 'dangao.png',
  [SymbolID.Brain]: 'danta.png',
  [SymbolID.Skull]: 'pisa.png',
  [SymbolID.Goblin]: 'tiantianquan.png',
  [SymbolID.Eyes]: 'tiantong.png',
}

export function getSymbolTexture(symbolId: SymbolID): Texture | undefined {
  return Assets.get(GameAssets.mainAtlas).textures[SymbolAssetMap[symbolId]]
}

export async function loadAssets(onProgress: ProgressCallback): Promise<void> {
  await Assets.load([GameAssets.mainAtlas, GameAssets.explosion, ...GameAssets.fonts], onProgress);
}

export function loadBackground(): Promise<Texture> {
  return Assets.load(GameAssets.background);
}
