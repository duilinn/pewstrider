import Censer from "./censer.js";
import CenserChain from "./censerChain.js";

export default class Priest {
  constructor(scene, x, y, priestSprite, health, isHostile=false, spawnPoint=null, hasCenser=false) {
    this.scene = scene;
    var xPos, yPos;
    if (spawnPoint)
    {
      this.spawnPoint = scene.map.findObject("objects", obj => obj.name === spawnPoint);
      xPos = this.spawnPoint.x;
      yPos = this.spawnPoint.y;
      console.log("test "+spawnPoint);
    }
    else {
      xPos = x;
      yPos = y;
    }

    // Create the physics-based sprite
    this.sprite = scene.physics.add
      .sprite(xPos, yPos, priestSprite, 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(32, 64)
      .setOffset(0,0);

    this.isHostile = isHostile;
    this.maxHealth = health;
    this.health = health;
    this.healthBarWidth = 50;
    this.isSeekingPlayer = false;
    this.graphics = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
    this.healthBar = new Phaser.Geom.Line(this.sprite.x-20, this.sprite.y-(this.sprite.height/2)-16,
    this.sprite.x+20, this.sprite.y-(this.sprite.height/2)-16);

    this.hasCenser = hasCenser;

    if (hasCenser)
    {
      //censer
      this.censer1 = new Censer(this.scene, this.sprite.x + 64, this.sprite.y, this, "censer", 120);

      //censer chain
      this.censerChain1 = new CenserChain(this.scene, this.sprite.x, this.sprite.y,
        this, this.censer1, "censerChain", 120);

    //smoke from censer

    this.particles =  this.scene.add.particles('smoke');
    this.emitter = this.particles.createEmitter(
      {
        alpha: {start: 1, end: 0},
        gravityY: -100,
      });
    }
  }

  create()
  {

    //censer


    this.scene.physics.world.addCollider(this.censer1.sprite, this.scene.blocks,
      this.censer1.changeDirection, null, this);
    this.scene.physics.world.addCollider(this.scene.player.sprite, this.censer1.sprite, null, null,
      this);

    this.emitter.setPosition(this.censer1.sprite.x, this.censer1.sprite.y);
    this.emitter.setSpeed(40);
    this.emitter.setAlpha(0.5);
    this.emitter.setFrequency(1, 20);
    this.emitter.setBlendMode(Phaser.BlendModes.DARKEN);

    this.isDying = false;

    this.isPewStriding = false;
    this.isJumping = false;

    this.scene.anims.create({
        key: 'priestStill',
        frames: anims.generateFrameNumbers(priestSprite, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });

    //health bar
    this.healthBar = new Phaser.Geom.Line(sprite.x-20, sprite.y-(sprite.height/2),
    sprite.x+20, sprite.y-(sprite.height/2));

    this.graphics.strokeLineShape(this.healthBar);

  }
  update() {
    const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;
    const acceleration = (onGround ? (this.isPewStriding ? 1200 :600) : 200);

    if (this.isPewStriding)
    {
      sprite.setMaxVelocity(600, 800);
      //console.log("pew striding");
    }
    else {
      sprite.setMaxVelocity(300, 400);
      //console.log("not pew striding");
    }

    this.scene.anims.play('priestStill', true);

    // Only allow the priest to jump if they are on the ground
    this.isJumping = false;
    if (this.isJumping) {
      sprite.setVelocityY(this.isPewStriding ? -700 : -500);
    }

    if (this.seekingPlayer)
    {
      this.moveTowardsPlayer(this.scene.player);
    }
    //update health bar
    this.graphics.clear();

    Phaser.Geom.Line.CenterOn(this.healthBar, this.sprite.x , this.sprite.y-(this.sprite.height/2)-16);

    const hsl = Phaser.Display.Color.HSVColorWheel();
    //console.log(Math.floor((this.health/this.maxHealth)*128) + " health: "+ this.health);
    this.graphics.lineStyle(10, hsl[Math.floor((this.health/this.maxHealth)*128)].color);

    this.healthBar.x1 = this.sprite.x-this.healthBarWidth/2;
    this.healthBar.x2 = (sprite.x-this.healthBarWidth/2) + (this.health/this.maxHealth)*this.healthBarWidth;
    this.graphics.strokeLineShape(this.healthBar);

    if (this.hasCenser)
    {
      this.censer1.update();
      this.censerChain1.update();

      if (this.scene.physics.world.overlap(this.scene.player.sprite, this.censer1.sprite))
      {
        this.scene.player.takeDamage(25);
      }
    }
    /*if (this.health>0)
    {
      this.health -= 0.5;
    }
    else {
      this.health = this.maxHealth;
    }*/
  }

  moveTowardsPlayer()
  {
    if (this.scene.player.sprite.x < this.sprite.x)
    {
      this.sprite.setAccelerationX(-300);
    }
    else if (this.scene.player.sprite.x > this.sprite.x){
      this.sprite.setAccelerationX(300);
    }
    else {
      this.sprite.setAccelerationX(0);
    }
  }

  die()
  {

  }
}
