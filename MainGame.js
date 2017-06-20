var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('tile', 'assets/sprites/Corner_Tile.png');

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var s = game.add.sprite(80, 0, 'tile');
        }
    }
    

    s.rotation = 0.14;

}