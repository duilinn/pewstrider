import Player from "./player.js";

export default class MainMenu extends Phaser.Scene {

  constructor()
  {
        super('MainMenu');
        var lastCheck;
  }

  preload() {
    this.load.bitmapFont('atari', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    this.cameras.main.setBackgroundColor("#200020")

    var add = this.add;
    var input = this.input;
    var title;
    var subtitle;
    var clickToStart;
    this.lastCheck = 0;

    WebFont.load({
        google: {
            families: [ "VT323", "Cormorant Garamond"]
        },
        active: function ()
        {

            title = add.text(400, 300, 'pewstrider', { fontFamily: "VT323", fontSize: 72, color: '#e0ffe0' })
            .setOrigin(0.5);

            subtitle = add.text(400, 350, 'a podioambulatory adventure', { fontFamily: "VT323", fontSize: 36, color: '#e0ffe0' })
            .setOrigin(0.5);

            clickToStart = add.text(400, 400, 'click to start', { fontFamily: "VT323", fontSize: 24, color: '#e0ffe0' })
            .setOrigin(0.5);
        }
    });

    /*var text = this.add.bitmapText(400, 300, "atari", "", 28).setOrigin(0.5).setCenterAlign();
    text.setText("pewstrider");
    */
    this.input.on('pointerdown', () => this.scene.start('Island'));
  }

  update(time, delta) {
    //  console.log(time)
    if ((time-this.lastCheck) > Math.floor(Math.random()*1000))
    {
        this.cameras.main.shake(Math.floor(Math.random()*100), 0.005, );
        this.lastCheck = time;
    }
  }
}
