export default class DialogBox {
  constructor(scene, x, y, dialogSprite, message) {
    this.scene = scene;
    this.message = message;
    
    // Create the physics-based sprite
    this.isShowing = false;
    this.dialogBox = this.scene.add.image(x, y, dialogSprite).setScrollFactor(0).setScale(2);
    this.dialogBox.setVisible(false);
    this.dialogText;
    this.dialogText = this.scene.add.text(32, 480, this.message, { fontFamily: "VT323",
        fontSize: 36, color: '#e0ffe0' }).setOrigin(0, 0.5).setScrollFactor(0).setVisible(false);
    console.log(this.message);



  }


  create()
  {

  }
  update() {

  }

  show()
  {

    this.isShowing = true;
    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true).setDepth(10);
  }

  hide()
  {
    this.isShowing = false;
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
  }
}
