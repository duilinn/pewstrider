import Player from "./player.js";

export default class PauseMenu extends Phaser.Scene {

  constructor(data)
  {
        super('PauseMenu');
  }

  init(data)
  {
    this.levelName = data.levelName;
  }

  preload() {


  }

  create() {
    console.log("paused");
    //this.cameras.main.setBackgroundColor("#404040")
    this.add.text(400, 300, "paused", {
        font: "72px VT323",
        fill: "#e0ffe0",
        padding: { x: 0, y: 0 },
        backgroundColor: "#200020",
      })
      .setOrigin(0.5).setScrollFactor(0);

    this.input.on('pointerdown', () => this.scene.switch("GameScene", { levelName: "PauseMenu"}));

  }

  update(time, delta) {

  }
}
