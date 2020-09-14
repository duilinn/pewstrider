import Player from "./player.js";
import Priest from "./priest.js";
import Sign from "./sign.js";
import SanctuaryLamp from "./sanctuaryLamp.js";

export default class Island extends Phaser.Scene {

  constructor()
  {
        super('Island');
        this.gamePaused = false;
        this.followPlayer = true;
        this.controls;
  }

  preload() {



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

    this.load.image("sign-2x1", "assets/images/sign-2x1.png");
    this.load.image("dialog-box", "assets/images/dialog-box.png");
    this.load.image("pauseButton", "assets/images/pause-button-1bit.png");

    this.load.image("tiles", "assets/tilesets/tiles_1bit_32x32.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/island.json");

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }



  create() {

    this.map = this.make.tilemap({ key: "map" });
    this.tiles = this.map.addTilesetImage("tiles_1bit_32x32", "tiles");

    this.sky = this.map.createStaticLayer("sky", this.tiles);
    this.walls = this.map.createStaticLayer("walls", this.tiles);
    this.windows = this.map.createStaticLayer("windows", this.tiles);
    this.blocks = this.map.createDynamicLayer("blocks", this.tiles);

    // Instantiate a player instance at the location of the "Spawn Point" object
    //in the Tiled map
    const playerSpawn =
    this.map.findObject("objects", obj => obj.name === "playerSpawn");
    this.player = new Player(this, playerSpawn.x, playerSpawn.y, 100);
    this.player.sprite.setDepth(100);

    // Collide the player against the ground layer - here we are grabbing the sprite property from
    // the player (since the Player class is not a Phaser.Sprite).
    this.blocks.setCollisionByProperty({ collides: true });
        this.blocks.setCollisionByProperty({ platform: true });
    this.blocks.forEachTile(tile => {
      //makes only top of pews, benches, etc solid
      if (tile.properties["platform"] == true)//(tile.properties["platform"]== true)
      {
      tile.collideLeft = false;
      tile.collideRight = false;
      tile.collideBottom = true;
      }
    })

    this.physics.world.addCollider(this.player.sprite, this.blocks);

    //priest

    this.priest1 = new Priest(this, 200, 900, "priestGreen", 120, false, "priest1Spawn", false);
    this.physics.world.addCollider(this.priest1.sprite, this.blocks);


    //tabernacle
    const tabernacleSpawn = this.map.findObject("objects", obj => obj.name === "tabernacleSpawn");
    this.tabernacle = this.physics.add.sprite(tabernacleSpawn.x, tabernacleSpawn.y, 'tabernacle', 0)
    .setImmovable();
    this.physics.world.addCollider(this.tabernacle, this.blocks);
    this.physics.world.addCollider(this.player.sprite, this.tabernacle,
      this.goToNextLevel, null, this);

    //sanctuary lamp
    const sanctuaryLamp1Spawn =
    this.map.findObject("objects", obj => obj.name === "sanctuaryLamp1Spawn");

    this.sanctuaryLamp1 = new SanctuaryLamp(this, sanctuaryLamp1Spawn.x, sanctuaryLamp1Spawn.y, "sanctuaryLamp");


    //sign
    const sign1Spawn =
    this.map.findObject("objects", obj => obj.name === "sign1Spawn");

    this.sign1 = new Sign(this, sign1Spawn.x, sign1Spawn.y, 'sign-2x1', 'dialog-box',
     'They are waiting for you.');
    this.sign1.create();

    this.physics.world.addCollider(this.player.sprite, this.sign1,
      this.sign1.show, null, this);

    //set up camera

    this.cameras.main.startFollow(this.player.sprite);
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(-500, -500, 5000, 5000);
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

    const { U, I, J, K, L } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({

      u: U,
      i: I,
      j: J,
      k: K,
      l: L,
    });

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),

        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


  }

  goToNextLevel()
  {
    this.scene.stop();
    this.scene.start('Level2');
  }


  update(time, delta) {
        //console.log(this.priest1.sprite.x + " " + this.priest1.sprite.y);
      const { keys, sprite } = this;

      if (keys.u.isDown)
      {
        this.followPlayer = !this.followPlayer;
        console.log(this.followPlayer);
        if (this.followPlayer)
        {
            this.cameras.main.stopFollow(this.player.sprite);
        }
        else
        {
          this.cameras.main.startFollow(this.player.sprite);
        }
      }

      this.controls.update(delta);


      //update game sprites

      this.player.update();
      this.priest1.update();
      this.sign1.update();



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
