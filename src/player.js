export default class Player {
  constructor(scene, x, y, health) {
    this.scene = scene;
    const anims = scene.anims;

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(32, 64)
      .setOffset(0,0);

    //health bar

    this.isDying = false;
    this.isDead = false;
    this.isPewStriding = false;

    this.maxHealth = health;
    this.health = health;
    this.healthBarWidth = 50;

    this.timeSinceLastDamage = 100;

    this.graphics = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
    this.healthBar = new Phaser.Geom.Line(this.sprite.x-20, this.sprite.y-(this.sprite.height/2)-16,
    this.sprite.x+20, this.sprite.y-(this.sprite.height/2)-16);

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    });

    // Update the animation/texture based on the state of the player
    anims.create({
        key: 'still',
          frames: anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });


    anims.create({
        key: 'walk',
        frames: anims.generateFrameNumbers('player', { start: 2, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    //health bar
    this.healthBar = new Phaser.Geom.Line(this.sprite.x-20, this.sprite.y-(this.sprite.height/2),
    this.sprite.x+20, this.sprite.y-(this.sprite.height/2));

    this.graphics.strokeLineShape(this.healthBar);

  }


  update() {
    var blockBelow = this.scene.blocks.getTileAtWorldXY(this.sprite.x,
      this.sprite.y + 32);
    //console.log(this.isPewStriding + " " + blockBelow);
    const { keys, sprite } = this;
    const onGround = this.sprite.body.blocked.down;
    const acceleration = (onGround ? (this.isPewStriding ? 1200 :600) : 200);

    if (this.isPewStriding)
    {
      this.sprite.setMaxVelocity(600, 800);
      //console.log("pew striding");
    }
    else {
      this.sprite.setMaxVelocity(300, 400);
      //console.log("not pew striding");
    }
      //console.log(acceleration);
    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      this.sprite.setAccelerationX(-acceleration);
      this.sprite.anims.play('walk', true);
      this.sprite.setFlipX(true);
    }
    else if (keys.right.isDown || keys.d.isDown)
    {
      this.sprite.setAccelerationX(acceleration);
      this.sprite.setFlipX(false);
      this.sprite.anims.play('walk', true);
    }
    else
    {
      //if (sprite.y<worldgetTileAt(player))
      this.sprite.setAccelerationX(0);
      this.sprite.anims.play('still', true);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      this.sprite.setVelocityY(this.isPewStriding ? -700 : -500);
    }



    //change speed for pew striding
    if (blockBelow && blockBelow.properties["pew"]===true) this.isPewStriding = true;//console.log("yes")}
    else if (blockBelow) this.isPewStriding = false;

    //update health bar
    this.graphics.clear();

    Phaser.Geom.Line.CenterOn(this.healthBar, this.sprite.x , this.sprite.y-(this.sprite.height/2)-16);

    const hsl = Phaser.Display.Color.HSVColorWheel();
    //console.log(Math.floor((this.health/this.maxHealth)*128) + " health: "+ this.health);
    this.graphics.lineStyle(10, hsl[Math.floor((this.health/this.maxHealth)*128)].color);

    this.healthBar.x1 = this.sprite.x-this.healthBarWidth/2;
    this.healthBar.x2 = (sprite.x-this.healthBarWidth/2) + (this.health/this.maxHealth)*this.healthBarWidth;
    this.graphics.strokeLineShape(this.healthBar);

    if (this.health == 0)
    {
      this.die();
    }

    if (this.timeSinceLastDamage<100) this.timeSinceLastDamage++;
    //console.log(" time since last damage: "+this.timeSinceLastDamage);
  }

  takeDamage(damage)
  {
    if (this.timeSinceLastDamage>20)
    {
      this.health -= damage;
      this.timeSinceLastDamage = 0;
    }

    if (this.health<0) this.health = 0;
    //console.log("player health = " + this.health);
  }

  die()
  {
    if (!this.isDying)
    {
      this.isDying = true;
      this.scene.cameras.main.fadeOut(1000);
      this.scene.cameras.main.once("camerafadeoutcomplete", () => {
        this.isDead = true;
      });
    }
  }
}
