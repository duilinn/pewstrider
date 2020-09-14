export default class Censer {
  constructor(scene, x, y, parent, sprite, health) {
    this.scene = scene;

    this.parent = parent;

    // Create the physics-based sprite
    this.sprite = scene.physics.add
          .sprite(this.parent.sprite.x + 64, this.parent.sprite.y, sprite, 0)
          .setDrag(1000, 0)
          .setMaxVelocity(300, 400)
          .setSize(32, 32)
          .setOffset(0,0);


    this.maxHealth = health;
    this.health = health;
    this.healthBarWidth = 50;
    this.censerSwing = 1;
    this.censerDirection = 1;
    //console.log(this.censerDirection);
    this.graphics = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
    this.healthBar = new Phaser.Geom.Line(this.sprite.x-20, this.sprite.y-(this.sprite.height/2)-16,
    this.sprite.x+20, this.sprite.y-(this.sprite.height/2)-16);
  }


  create()
  {


    this.isDying = false;
    this.censerDirection = 1;

    /*this.scene.anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers(priestSprite, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });*/

    //health bar
    this.healthBar = new Phaser.Geom.Line(sprite.x-20, sprite.y-(sprite.height/2),
    sprite.x+20, sprite.y-(sprite.height/2));

    this.graphics.strokeLineShape(this.healthBar);

  }
  update() {
    //censer
    if (false) //(this.censerDirection < 0.1)
    {
      this.censerDirection += 0.001;
    }
    else {
      this.censerDirection = -0.01;
    }
    //this.censerDirection += 0.01;
    this.censerSwing += this.censerDirection;//console.log(this.censerDirection); //0.02 * Math.PI * this.censerDirection;
    //if (this.censerSwing>2*Math.PI) { this.censerSwing = 0};

    this.sprite.setX(this.parent.sprite.x + (Math.sin(this.censerSwing)* 100));
    this.sprite.setY(this.parent.sprite.y - (Math.cos(this.censerSwing)* 100));
    this.sprite.rotation = this.censerSwing+Math.PI;


    //update health bar
    this.graphics.clear();

    Phaser.Geom.Line.CenterOn(this.healthBar, this.sprite.x , this.sprite.y-(this.sprite.height/2)-16);

    const hsl = Phaser.Display.Color.HSVColorWheel();
    //console.log(Math.floor((this.health/this.maxHealth)*128) + " health: "+ this.health);
    this.graphics.lineStyle(10, hsl[Math.floor((this.health/this.maxHealth)*128)].color);

    this.healthBar.x1 = this.sprite.x-this.healthBarWidth/2;
    this.healthBar.x2 = (this.sprite.x-this.healthBarWidth/2) + (this.health/this.maxHealth)*this.healthBarWidth;
    this.graphics.strokeLineShape(this.healthBar);

  }

  die()
  {

  }

  changeDirection()
  {
    if (this.censerDirection<0)
    {
      this.censerDirection = 0.01;
    }
    else
    {
      this.censerDirection = -0.01;
    }
    console.log(this.censerDirection);
  }
}
