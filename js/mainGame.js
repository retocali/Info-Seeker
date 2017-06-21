
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

// Constants to for the map 
var width = 3;
var length = 3;
var tileSize = 140;

// TODO: Maybe have a function to search through folder for filenames?
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];


function preload() {
    game.load.image('rotateClock',"assets/sprites/Rotate_Clockwise.png");
    game.load.image('rotateCounter',"assets/sprites/Rotate_Counter_Clockwise.png");
    // Used to load the images as sprites to randomly access
    for (var i = 0; i < tileNames.length; i++) {
    
        game.load.image('tile'+i, 'assets/sprites/tiles/' + tileNames[i]);
        tiles.push('tile'+i);
    }
}

function create() {
    
    game.stage.backgroundColor = 'rgba(125,125,0,0)';

    // Creates the board
    for (let x = 0; x < width; x++) {
        
        for (let y = 0; y < length; y++) {
            
            // TODO: Tweak this to actually center it
            // Finds the centered placement of the tiles 
            let xLoc = game.world.centerX+x*tileSize-width/2*tileSize;
            let yLoc = game.world.centerY+y*tileSize-length/2*tileSize;

            // Creates the actual sprites and adds a handler to rotate it
            let s = game.add.sprite(xLoc, yLoc, tiles[Math.floor(Math.random()*tiles.length)]);
            
            s.anchor.setTo(0.5,0.5);
            s.inputEnabled = true;
            s.events.onInputDown.add(menuCreate(s), this);
            s.events.onInputOver.add(highlights(s), this);
            s.events.onInputOut.add(highlight2(s),this);
        }
    }
}

function highlights(s) {
    return function() {
        s.tint = Math.random() * 0xffffff;
    }
}

function highlight2(s) {
    return function() {
        s.tint = 0xffffff;
    }
}

function menuCreate(s) {
    return function() {

        let group = game.add.group();

        let button1 = game.make.button(0, 450, 'rotateClock', removeGroup, this, 20, 10, 0);
        let button2 = game.make.button(128, 450, 'rotateCounter', removeGroup, this, 20, 10, 0);

        function removeGroup() {
            game.world.remove(button1);
            game.world.remove(button2);
            game.world.remove(group);

        }
        button1.onInputDown.add(function() {s.angle += 90;}, this);
        button2.onInputDown.add(function() {s.angle -= 90;}, this);

        button1.events.onInputOver.add(highlights(button1),this);
        button2.events.onInputOver.add(highlights(button2),this);
        button1.events.onInputOut.add(highlight2(button1),this);
        button2.events.onInputOut.add(highlight2(button2),this);

        group.add(button1);
        group.add(button2);  
    }
}

function update() {
    
}


class BasicTile {
    constructor(exits, rotation) {
        this.exits = exits;
        this.rotation = rotation
    }
    
}