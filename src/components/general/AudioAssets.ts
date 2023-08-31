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
