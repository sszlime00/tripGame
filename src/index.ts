import { Administer } from './Administer';
import { LobbyScene } from './Page/StartGame';
import { loadAssets } from './scripts/assetLoad';
import { GameScene } from './Page/Game';

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
  Administer.changeScene(new GameScene({
    limitScore: 500,
    limitTime: 60,
  }));
})();
