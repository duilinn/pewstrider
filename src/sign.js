import DialogBox from "./dialogBox.js";
export default class Sign {
  constructor(scene, x, y, signSprite, dialogSprite, message) {
    this.scene = scene;

    // Create the physics-based sprite
    this.sprite = scene.physics.add.sprite(x, y, signSprite, 0).setImmovable();
    this.sprite.body.setAllowGravity(false);
    this.isShowing = false;


    this.message = message;
    this.dialogBox = new DialogBox(this.scene, 400, 520, dialogSprite, this.message);
  }


  create()
  {


  }
  update() {
    if (this.scene.physics.world.overlap(this.scene.player.sprite, this.sprite))
    {
      if (!this.dialogBox.isShowing) this.dialogBox.show();
    }
    else
    {
      if (this.dialogBox.isShowing) this.dialogBox.hide();console.log("hide");
    }
  }


}
