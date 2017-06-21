
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

// Constants to for the map 
var width = 3;
var length = 3;
var tileSize = 140;

// TODO: Maybe have a function to search through folder for filenames?
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];


function preload() {
    
    // Used to load the images as sprites to randomly access
    for (var i = 0; i < tileNames.length; i++) {
    
        game.load.image('tile'+i, 'assets/sprites/tiles/' + tileNames[i]);
        tiles.push('tile'+i);
    }
}

function create() {
    
    game.stage.backgroundColor = 'rgba(125,125,0,0)';

    // Creates the board
    for (var x = 0; x < width; x++) {
        
        for (var y = 0; y < length; y++) {
            
            // TODO: Tweak this to actually center it
            // Finds the centered placement of the tiles 
            let xLoc = game.world.centerX+x*tileSize-width/2*tileSize;
            let yLoc = game.world.centerY+y*tileSize-length/2*tileSize;

            // Creates the actual sprites and adds a handler to rotate it
            let s = game.add.sprite(xLoc, yLoc, tiles[Math.floor(Math.random()*tiles.length)]);
            
            s.anchor.setTo(0.5,0.5);
            s.inputEnabled = true;
            s.events.onInputDown.add(function () { s.angle += 90;}, s)
        }
    }
}

function update() {
    
}