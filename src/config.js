import MainMenu from "./MainMenu.js";
import PauseMenu from "./PauseMenu.js";
import GameScene from "./GameScene.js";
import Level2 from "./Level2.js";
import Ending from "./Ending.js";
import Island from "./Island.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#200020",
  scene: [MainMenu, Island, GameScene, Level2, Ending, PauseMenu],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  }
};

export { config }
