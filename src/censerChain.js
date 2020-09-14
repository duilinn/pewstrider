export default class CenserChain {
  constructor(scene, x, y, parent1, parent2, sprite, health) {
    this.scene = scene;


    // Create the physics-based sprite
    this.averageX = (parent1.sprite.x + parent2.sprite.x)/2;
    this.averageY = (parent1.sprite.y + parent2.sprite.y)/2;

    this.sprite = scene.physics.add
          .sprite(this.averageX, this.averageY, sprite, 0)
          .setDrag(1000, 0)
          .setMaxVelocity(300, 400)
          .setSize(32, 64)
          .setOffset(0,0);
          //.setAllowGravity(false);

    this.parent1 = parent1;
    this.parent2 = parent2;

    this.maxHealth = health;
    this.health = 0;
    this.healthBarWidth = 50;

    //this.graphics = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
    //this.healthBar = new Phaser.Geom.Line(this.sprite.x-20, this.sprite.y-(this.sprite.height/2)-16,
    //this.sprite.x+20, this.sprite.y-(this.sprite.height/2)-16);
  }

  create()
  {


    //this.isDying = false;

    //this.isPewStriding = false;
    //this.isJumping = false;

    /*this.scene.anims.create({
        key: 'priestStill',
        frames: anims.generateFrameNumbers(priestSprite, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });*/

    //health bar
    //this.healthBar = new Phaser.Geom.Line(sprite.x-20, sprite.y-(sprite.height/2),
    //sprite.x+20, sprite.y-(sprite.height/2));

    //this.graphics.strokeLineShape(this.healthBar);

  }
  update() {
    /*const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;
    const acceleration = (onGround ? (this.isPewStriding ? 1200 :600) : 200);*/

    this.averageX = (this.parent1.sprite.x + this.parent2.sprite.x)/2;
    this.averageY = (this.parent1.sprite.y + this.parent2.sprite.y)/2;

    this.sprite.setX(this.averageX);
    this.sprite.setY(this.averageY);
    this.sprite.rotation = this.parent2.sprite.rotation;


    //update health bar
    //this.graphics.clear();

    /*Phaser.Geom.Line.CenterOn(this.healthBar, this.sprite.x , this.sprite.y-(this.sprite.height/2)-16);

    const hsl = Phaser.Display.Color.HSVColorWheel();
    //console.log(Math.floor((this.health/this.maxHealth)*128) + " health: "+ this.health);
    this.graphics.lineStyle(10, hsl[Math.floor((this.health/this.maxHealth)*128)].color);

    this.healthBar.x1 = this.sprite.x-this.healthBarWidth/2;
    this.healthBar.x2 = (this.sprite.x-this.healthBarWidth/2) + (this.health/this.maxHealth)*this.healthBarWidth;
    this.graphics.strokeLineShape(this.healthBar);*/

  }

  die()
  {

  }

}
