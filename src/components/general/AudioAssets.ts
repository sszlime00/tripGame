import { Howl } from 'howler';
import { GameAssets } from '../../scripts/assetLoad'; 

export const music = new Howl({
  src: ['music.mp3'],
  volume: 0.5,
  preload: true,
  onload: () => {
    console.log('音频加载好了');
  }
});

export const explodeSound = new Howl({
  src: ['buck.mp3'],
  volume: 0.6,
  rate: 1.2,
  preload: true,
  onload: () => {
    console.log('消失音频加载好了');
  }
});

export const errorSound = new Howl({
  src: ['error.mp3'],
  volume: 1.2,
  preload: true,
  onload: () => {
    console.log('错误音频加载好了');
  }
  });
