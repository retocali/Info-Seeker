var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
var width = 3;
var length = 3;
var tileSize = 128;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('tile', 'assets/sprites/tiles/Corner_Tile.png');

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < length; y++) {
            var s = game.add.sprite(x*tileSize, y*tileSize, 'tile');
        }
    }

}
function update() {
    
}