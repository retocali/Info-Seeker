var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
var width = 3;
var length = 3;
var tileSize = 140;
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];
function preload() {

    
    for (var i = 0; i < tileNames.length; i++) {
        game.load.image('tile'+i, 'assets/sprites/tiles/' + tileNames[i]);
        tiles.push('tile'+i);
    }
}

function create() {
    game.stage.backgroundColor = 'rgba(125,125,0,0)';

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < length; y++) {
            let s = game.add.sprite(game.world.centerX+x*tileSize-width/2*tileSize, game.world.centerY+y*tileSize-length/2*tileSize, tiles[Math.floor(Math.random()*tiles.length)]);
            s.anchor.setTo(0.5,0.5);
            s.inputEnabled = true;
            s.events.onInputDown.add(function () { s.angle += 90;}, s)
        }
    }
}

function update() {
    
}