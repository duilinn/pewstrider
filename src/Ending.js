import Player from "./player.js";

export default class Ending extends Phaser.Scene {

  constructor()
  {
        super('Ending');
  }

  preload() {


  }

  create() {
    console.log("ending");
    this.cameras.main.setBackgroundColor("#ffffff")

    this.add.text(400, 300, "you won", {
        font: "16px sans serif",
        fill: "#000000",
        padding: { x: 0, y: 0 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0);
  }

  update(time, delta) {

  }
}
