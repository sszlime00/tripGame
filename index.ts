import { Administer } from './src/Administer';
import { StartGame } from './src/Page/StartGame';
import { loadAssets, GameAssets } from './src/scripts/assetLoad';
import { Game } from './src/Page/Game';
import { Howl } from 'howler';
import { music }from './src/components/general/AudioAssets'



async function loadGame(): Promise<void> {
  const loading = document.getElementById('loading');
  const barFill = document.getElementById('bar-fill');
  const updateProgress = (progress: number) => {
    barFill.style.width = `${progress * 100}%`;
  }
  await loadAssets(updateProgress);
  setTimeout(() => {
    loading.style.display = 'none';
  }, 200);
}

(async function () {
  const app = await Administer.initialize();
 
  (globalThis as any).__PIXI_APP__ = app;
  await loadGame();
    Administer.changeScene(new StartGame(music));
})();
