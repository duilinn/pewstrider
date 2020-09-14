export default class SanctuaryLamp {
  constructor(scene, x, y, sprite) {
    this.scene = scene;

    this.sprite = this.scene.physics.add.sprite(x, y, sprite, 0).setImmovable();

    this.sprite.body.setAllowGravity(false);

    this.scene.anims.create({
        key: 'sanctuaryLamp',
          frames: this.scene.anims.generateFrameNumbers('sanctuaryLamp', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1
    });


    this.sprite.anims.play('sanctuaryLamp', true);


  }


  create()
  {



  }
  update() {

  }
}
