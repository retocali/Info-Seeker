
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

// Constants to for the map 
var width = 3;
var length = 3;
var tileSize = 140;

// TODO: Maybe have a function to search through folder for filenames?
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];


function preload() {
    // Used to load menu icons
    game.load.image('rotateClock',"assets/sprites/Rotate_Clockwise.png");
    game.load.image('rotateCounter',"assets/sprites/Rotate_Counter_Clockwise.png");

    // Used to load the images as sprites to randomly access
    for (var i = 0; i < tileNames.length; i++) {
    
        game.load.image('tile'+i, 'assets/sprites/tiles/' + tileNames[i]);
        tiles.push('tile'+i);
    }
}

function create() {
    
    var board = [[],[],[]];

    game.stage.backgroundColor = 'rgba(125,125,0,0)';
    
    

    // Creates the board
    for (let x = 0; x < width; x++) {
        
        for (let y = 0; y < length; y++) {
            
            
            // TODO: Tweak this to actually center it
            // Finds the centered placement of the tiles 
            let xLoc = game.world.centerX+x*tileSize-width/2*tileSize;
            let yLoc = game.world.centerY+y*tileSize-length/2*tileSize;

            // Creates the actual sprites and adds a handler to rotate it
            let tileName = tiles[Math.floor(Math.random()*tiles.length)];
            let s = new BasicTile(findExits(tileName), 0, xLoc, yLoc, tileName);
            board[x][y] = s; 

            s.image.anchor.setTo(0.5,0.5);
            s.image.inputEnabled = true;
            s.image.events.onInputDown.add(menuCreate(s), this);
        }
    }
}
function menuCreate(s) {
    return function() {

        let group = game.add.group();

        let button1 = game.make.button( 0 ,450, 'rotateClock'  , removeGroup, this, 20, 10, 0);
        let button2 = game.make.button(128,450, 'rotateCounter', removeGroup, this, 20, 10, 0);

        function removeGroup() {
            button1.destroy();
            button2.destroy();
            game.world.remove(group);
        }
        button1.onInputDown.add(function() {s.rotateClockWise();}, this);
        button2.onInputDown.add(function() {s.rotateCounterClockWise()}, this);

        group.add(button1);
        group.add(button2);  
    }
}



function update() {
    
}

function findExits(tileName) {
    // 4 being the length of the word tile
    let index = tileName.slice(4, tileName.length);
    switch(tileNames[index]) {
        case "Corner_Tile.png":
            return [1,1,0,0];
        case "Cross_Tile.png":
            return [1,1,1,1];
        case "DeadEnd_Tile.png":
            return [1,0,0,0];
        case "Line_Tile.png":
            return [1,0,1,0];
        case "Tetris_Tile.png":
            return [1,1,1,0];
        default:
            return [0,0,0,0];
    }

}

class BasicTile {
    // exits : represent as an array of length 4
    //          North: Index 0,
    //          West:  Index 1,
    //          South: Index 2,
    //          East:  Index 3,
    //          With Value 1 at the index meaning there is an exit
    //               Value 0 meaning there isn't
    // rotation: keeps track of the rotation of the tile and is between 0 <= x <= 360

    constructor(exits, rotation, xLoc, yLoc, tileName) {
        this.image = game.add.sprite(xLoc, yLoc, tileName);
        this.exits = exits;
        this.rotation = rotation;
    }
    canGoNorth () {
        return this.exits[(this.rotation/90)];
    }
    canGoWest () {
        return this.exits[(1+(this.rotation/90)) % 4];
    }
    canGoSouth () {
        return this.exits[(2+(this.rotation/90)) % 4];
    }
    canGoEast () {
        return this.exits[(3+(this.rotation/90)) % 4];
    }
    rotateClockWise() {
        this.rotation = (this.rotation + 90) % 360;
        this.image.angle += 90;
        console.log(this.canGoNorth());
        
    }
    rotateCounterClockWise() {
        this.rotation = (this.rotation + 270) % 360;
        this.image.angle -= 90;
        console.log(this.canGoNorth());
    }

}