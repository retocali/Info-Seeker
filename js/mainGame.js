var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
var width = 3;
var length = 3;
var tileSize = 140;
var tileNames = ["Corner_tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('tile', 'assets/sprites/tiles/' + tileNames[Math.floor(Math.random()*6)]);

}

function create() {
    game.stage.backgroundColor = 'rgba(125,125,0,0)';

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < length; y++) {
            let s = game.add.sprite(game.world.centerX+x*tileSize-width/2*tileSize, game.world.centerY+y*tileSize-length/2*tileSize, 'tile');
            s.anchor.setTo(0.5,0.5);
            s.inputEnabled = true;
            s.events.onInputDown.add(function () { s.angle += 90;}, s)
        }
    }
}

function update() {
    
}