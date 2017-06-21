
var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
var board;
var player;
var guard;
var playerPos;
var guardPos;


// Constants to for the map 
var width = 3;
var length = 3;
var tileSize = 140;


// TODO: Maybe have a function to search through folder for filenames?
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];


function preload() {
    
    // The sprite for the player
    game.load.image('player', "assets/sprites/Player.png");
    game.load.image('guard', "assets/sprites/Guard.png");

    // Used to load menu icons
    game.load.image('move', "assets/sprites/Move.png");
    game.load.image('rotateClock',"assets/sprites/Rotate_Clockwise.png");
    game.load.image('rotateCounter',"assets/sprites/Rotate_Counter_Clockwise.png");

    // Used to load the images as sprites to randomly access
    for (var i = 0; i < tileNames.length; i++) {
    
        game.load.image('tile'+i, 'assets/sprites/tiles/' + tileNames[i]);
        tiles.push('tile'+i);
    }
}

function create() {
    
    board = [[],[],[],[],[]];

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
            let s = new BasicTile(findExits(tileName), 0, xLoc, yLoc, tileName, x, y);
            board[x][y] = s; 

            s.image.anchor.setTo(0.5,0.5);
            s.image.inputEnabled = true;
            s.image.events.onInputDown.add(menuCreate(s), this);
            addHighlight(s.image);
        }
    }
    // Creates the Guard
    guard = game.add.sprite(game.world.centerX+2*tileSize-width/2*tileSize, game.world.centerY+2*tileSize-length/2*tileSize, 'guard');
    guardPos = {x:2, y:2}
    guard.anchor.setTo(0.5,0.5);
    // Creates the player
    player = game.add.sprite(game.world.centerX-width/2*tileSize, game.world.centerY-length/2*tileSize, 'player');
    playerPos = {x:0, y:0}
    player.anchor.setTo(0.5,0.5);
    player.inputEnabled = true;
    
}

function addHighlight(s) {
    s.events.onInputOver.add(highlights(s), this);
    s.events.onInputOut.add(normalize(s),this);
}

function highlights(s) {
    return function() {
        s.tint = Math.random() * 0xffffff;
    }
}

function normalize(s) {
    return function() {
        s.tint = 0xffffff;
    }
}

var button1;
var button2;
var group;
function menuCreate(s) {
    return function() {
        if (group) {
            button1.destroy();
            button2.destroy();
            button3.destroy();
        }


        group = game.add.group();

        button1 = game.make.button( 0 ,450, 'rotateClock'  , removeGroup, this, 20, 10, 0);
        button2 = game.make.button(128,450, 'rotateCounter', removeGroup, this, 20, 10, 0);
        button3 = game.make.button(256,450, 'move', removeGroup, this, 20, 10, 0);
        function removeGroup() {
            button1.destroy();
            button2.destroy();
            button3.destroy();
            game.world.remove(group);

        }
        button1.onInputDown.add(function() {s.rotateClockWise();}, this);
        button2.onInputDown.add(function() {s.rotateCounterClockWise();}, this);
        button3.onInputDown.add(function() {movePlayer(s);}, this);

        addHighlight(button1);
        addHighlight(button2);
        addHighlight(button3);

        group.add(button1);
        group.add(button2);  
        group.add(button3);
    }
}

function update() {
    
}

function movePlayer(tile) {
    let xMove = playerPos.x - tile.x;
    let yMove = playerPos.y - tile.y;
    if (xMove == 0) {
        if (yMove == -1 && tile.canGoNorth() && board[playerPos.x][playerPos.y].canGoSouth()) {
            playerPos.y += 1;
        }
        if (yMove == 1  && tile.canGoSouth() && board[playerPos.x][playerPos.y].canGoNorth()) {
            playerPos.y -= 1;
        }
    }
    else if (yMove == 0) {
        if (xMove == -1 && tile.canGoWest() && board[playerPos.x][playerPos.y].canGoEast()) {
            playerPos.x += 1;
        }
        if (xMove == 1  && tile.canGoEast() && board[playerPos.x][playerPos.y].canGoWest()) {
            playerPos.x -= 1;
        }
    }
    player.x = game.world.centerX+playerPos.x*tileSize-width/2*tileSize;
    player.y = game.world.centerY+playerPos.y*tileSize-length/2*tileSize;
    player.bringToTop;
    moveGuard();
}

function moveGuard() {
    let possibleMoves = [];
    if (guardPos.y < length-1) {
        if (board[guardPos.x][guardPos.y+1].canGoNorth() && board[guardPos.x][guardPos.y].canGoSouth()) {
            possibleMoves.push([0,1]);
        }
    }
    if (guardPos.y > 0) {
        if (board[guardPos.x][guardPos.y-1].canGoSouth() && board[guardPos.x][guardPos.y].canGoNorth()) {
            possibleMoves.push([0,-1]);
        }
    }
    if (guardPos.x < width-1) {
        if (board[guardPos.x+1][guardPos.y].canGoWest() && board[guardPos.x][guardPos.y].canGoEast()) {
            possibleMoves.push([1,0]);
        }
    }
    if (guardPos.x > 0) {
        if (board[guardPos.x-1][guardPos.y].canGoEast() && board[guardPos.x][guardPos.y].canGoWest()) {
            possibleMoves.push([-1,0]);
        }
    }
    if (possibleMoves.length != 0) {
        let pickedMove = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
        guardPos.x += pickedMove[0];
        guardPos.y += pickedMove[1];
    }
    
    guard.x = game.world.centerX+guardPos.x*tileSize-width/2*tileSize;
    guard.y = game.world.centerY+guardPos.y*tileSize-length/2*tileSize;
    guard.bringToTop;
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

    constructor(exits, rotation, xLoc, yLoc, tileName, x, y) {
        this.x = x;
        this.y = y;
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
        
    }
    rotateCounterClockWise() {
        this.rotation = (this.rotation + 270) % 360;
        this.image.angle -= 90;
    }

}