import Player from "./player.js";
import Priest from "./priest.js";
import Censer from "./censer.js";
import CenserChain from "./censerChain.js";

export default class GameScene extends Phaser.Scene {

  constructor()
  {
        super('GameScene');
        this.gamePaused = false;
  }

  preload() {

    this.load.spritesheet(
      "player",
      "assets/atlas/player-1bit.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      }
    );

    this.load.spritesheet(
      "priestGreen",
      "assets/atlas/ordinary-time-priest-1bit.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      }
    );

    this.load.image("censer", "assets/images/censer-1bit.png");
    this.load.image("censerChain", "assets/images/censer-chain-1bit.png");
    this.load.image("smoke", "assets/images/smoke-1bit.png");

    this.load.image("tabernacle", "assets/images/tabernacle-1bit.png");

    this.load.spritesheet(
      "sanctuaryLamp",
      "assets/atlas/sanctuary-lamp-1bit.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.load.image("pauseButton", "assets/images/pause-button-1bit.png");
    this.load.image("tiles", "assets/tilesets/tiles_1bit_32x32.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/level1-1bit.json");
  }



  create() {

    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("tiles_1bit_32x32", "tiles");

    this.walls = map.createDynamicLayer("walls", tiles);
    this.windows = map.createDynamicLayer("windows", tiles);
    this.blocks = map.createDynamicLayer("blocks", tiles);

    // Instantiate a player instance at the location of the "Spawn Point" object
    //in the Tiled map
    const playerSpawn =
    map.findObject("objects", obj => obj.name === "playerSpawn");
    this.player = new Player(this, playerSpawn.x, playerSpawn.y, 100);


    // Collide the player against the ground layer - here we are grabbing the sprite property from
    // the player (since the Player class is not a Phaser.Sprite).
    this.blocks.setCollisionByProperty({ collides: true });
    this.blocks.forEachTile(tile => {
      //makes only top of pews solid
      if (tile.index === 6)
      {
      tile.collideLeft = false;
      tile.collideRight = false;
      tile.collideBottom = true;
      }
      })

    this.physics.world.addCollider(this.player.sprite, this.blocks);

    //priest

    const priest1Spawn =
    map.findObject("objects", obj => obj.name === "priest1Spawn");
    this.priest1 = new Priest(this, 200, 900, "priestGreen", 120);
    this.physics.world.addCollider(this.priest1.sprite, this.blocks);

    //censer

    this.censer1 = new Censer(this, this.priest1.x + 64, this.priest1.y, this.priest1, "censer", 120);

    this.physics.world.addCollider(this.censer1.sprite, this.blocks,
      this.censer1.changeDirection, null, this);
    this.physics.world.addCollider(this.player.sprite, this.censer1.sprite, null, null,
      this);

    //censer chain
    this.censerChain1 = new CenserChain(this, this.priest1.sprite.x, this.priest1.sprite.y,
      this.priest1, this.censer1, "censerChain", 120);

    //smoke from censer

    this.particles =  this.add.particles('smoke');
    this.emitter = this.particles.createEmitter(
      {
        alpha: {start: 1, end: 0},
        gravityY: -100,
      });
    this.emitter.setPosition(this.censer1.sprite.x, this.censer1.sprite.y);
    this.emitter.setSpeed(40);
    this.emitter.setAlpha(0.5);
    this.emitter.setFrequency(1, 20);
    this.emitter.setBlendMode(Phaser.BlendModes.DARKEN);

    //tabernacle

    this.tabernacle = this.physics.add.sprite(62.5*32, 26.5*32, 'tabernacle', 0)
    .setImmovable();
    this.physics.world.addCollider(this.tabernacle, this.blocks);
    this.physics.world.addCollider(this.player.sprite, this.tabernacle,
      this.goToNextLevel, null, this);

    //sanctuary lamp

    this.sanctuaryLamp = this.physics.add.sprite(50.5*32, 24.5*32, 'sanctuaryLamp',
     0).setImmovable();
    this.sanctuaryLamp.body.setAllowGravity(false);

    this.anims.create({
        key: 'sanctuaryLamp',
          frames: this.anims.generateFrameNumbers('sanctuaryLamp', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1
    });

    this.sanctuaryLamp.anims.play('sanctuaryLamp', true);

    //set up camera

    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    /*this.levelIndicator = this.add
      .text(16, 16, "pewstrider, if it actually works", {
        font: "16px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);*/


    this.pauseButton = this.add.image(16,
      16, "pauseButton").setScrollFactor(0).setInteractive();
    this.pauseButton.name = "pauseButton";
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject.name=="pauseButton")
      {
        console.log("pausing");

        //this.gamePaused = true;
        this.scene.switch("PauseMenu", { levelName: "GameScene"});
      }
    });
  }

  goToNextLevel()
  {
    this.scene.stop();
    this.scene.start('Level2');
  }


  update(time, delta) {


      //smoke from censer

      this.emitter.setPosition(this.censer1.sprite.x, this.censer1.sprite.y)

      //update player and priest

      var blockBelow = this.blocks.getTileAtWorldXY(this.player.sprite.x,
        this.player.sprite.y + 32);

      this.player.update(blockBelow);
      this.priest1.update(this.player);
      this.censer1.update();
      this.censerChain1.update();
      if (this.physics.world.overlap(this.player.sprite, this.censer1.sprite))
      {
        this.player.takeDamage(25);
      }

      if (this.player.isDead) this.scene.restart();

      //this.pauseButton.setX(this.cameras.main.scrollX+16);
      //this.pauseButton.setY(this.cameras.main.scrollY+16);
  }

  /* pauseGame()
  {
    console.log("paused");
    this.cameras.main.setBackgroundColor("#404040")

    this.add.text(230, 275, "paused", {
        font: "48px serif italic",
        fill: "#808080",
        padding: { x: 0, y: 0 },
        backgroundColor: "#404040",
      })
      .setScrollFactor(0);
  } */

}
