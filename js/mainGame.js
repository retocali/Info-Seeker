var canvas_x = 1000;
var canvas_y = 850;

var game = new Phaser.Game(canvas_x, canvas_y, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
var board;
var player;
var guard;
var playerPos;
var entrance;
var exit;
var guardPos;
var gameDone;
var logo;

//music found from https://www.dl-sounds.com/royalty-free/category/game-film/video-game/ && http://freesound.org
//https://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser source
//for the game over scree


// For keeping tracking of turns
var moved = false;
var rotated = false


// Constants to for the map 
var width = 3;
var length = 3;
var tileSize = 140;
var comboSpawn = 0.1;


// TODO: Maybe have a function to search through folder for filenames?
var replayImage = "button_restart.png"
var entrix = "EntranceExit.png";
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png","Line_Tile.png","Tetris_Tile.png"];
var tiles = [];
var comboTileNames = ["Dead_End_2.png","Line_Combo.png","Loop_Tile_2.png"];
var comboTiles = []

function preload() {

    // Used to load GAME OVER 
    game.load.image('gameover', 'assets/sprites/gameover.png');

    // Splash Screen
    game.load.image('logo', 'assets/sprites/welcome.jpg');

    // Used to load entrance/exit and restart button
    game.load.image('entrix',"assets/sprites/tiles/EntranceExit.png");
    game.load.image('replayImage',"assets/sprites/button_restart.png");
    
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

    // same as above but for the combo tiles
    for (var m = 0; m < comboTileNames.length; m++) {
        game.load.image('combo'+m, 'assets/sprites/tiles/' + comboTileNames[m]);
        comboTiles.push('combo'+m);
    }
}

function create() {

    game.stage.backgroundColor = "#4488AA";

    game.scale.pageAlignHorizontally = true; game.scale.pageAlignVeritcally = true; game.scale.refresh();
    board = [[],[],[]];

    // Creates the board
    for (let x = 0; x < width; x++) {
        
        for (let y = 0; y <= length + 1; y++) {
            
            // TODO: Tweak this to actually center it
            // Finds the centered placement of the tiles 
            let xLoc = game.world.centerX+(x-1)*tileSize;
            let yLoc = game.world.centerY+(y-2)*tileSize;
            let s;
            if (y == 0) {
                if (x == 0) {
                    //Creates the entrance
                    s = new BasicTile([0,0,1,0], 0, xLoc, yLoc, "entrix", x, y);
                    entrance = s;
                } else {
                    s = new BasicTile([0,0,0,0], 0, xLoc, yLoc, "", x, y);
                }
            }
            else if (y == length + 1) {
                // Creates the exit
                if (x == width - 1) {
                    s = new BasicTile([0,0,1,0], 180, xLoc, yLoc, "entrix",x, y);
                    s.image.scale.y *= -1;
                    exit = s
                } else {
                    s = new BasicTile([0,0,0,0], 0, xLoc, yLoc, "", x, y);
                }
            } else if (Math.random() < comboSpawn){
                let tileName = comboTiles[Math.floor(Math.random()*comboTiles.length)];
                s = new ComboTile(findComboExits(tileName), 0, xLoc, yLoc, tileName, x, y);
            } else {
                // Creates the actual sprites and adds a handler to rotate it
                let tileName = tiles[Math.floor(Math.random()*tiles.length)];
                s = new BasicTile(findExits(tileName), 0, xLoc, yLoc, tileName, x, y);
            }
            board[x][y] = s; 
        }
    }
    // Creates the Guard
    guard = game.add.sprite(game.world.centerX+tileSize, game.world.centerY+tileSize, 'guard');
    guardPos = {x:exit.x, y:exit.y}
    guard.anchor.setTo(0.5,0.5);
    // Creates the player
    player = game.add.sprite(game.world.centerX-tileSize, game.world.centerY-(length-1)*tileSize, 'player');
    playerPos = {x:entrance.x, y:entrance.y}
    player.anchor.setTo(0.5,0.5);
    player.inputEnabled = true;

    //Creates the restart button
    restartButton = game.add.button(game.world.centerX + 300, 100, 'replayImage', actionOnClick, this);
    restartButton.scale.setTo(0.41,0.41);

    //Splash screen
    logo = game.add.sprite(0, 0, "logo");
    logo.scale.setTo(0.18,0.25);
    logo.fixedtoCamera = true;
    game.input.onDown.add(removeLogo, this);
}


//used with the splash screen
function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    //tried to use this to fade in/fade out the welcome...
    // game.add.tween(sprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    logo.kill();
}

// used with the restart button
function actionOnClick () {
    playerPos = {x:entrance.x, y:entrance.y};
    guardPos = {x:exit.x, y:exit.y}
     for (let x = 0;  x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            board[x][y].rotation = 0;
            board[x][y].image.angle = 0;
        }
    }
    rotated = false;
    moved = false;
    reset();
}

//call this function when the player loses
function GameOver () {
    gameDone = game.add.sprite(200, 80, 'gameover');
    gameDone = gameDone.scale.setTo(2.2,2.7);
}

function addHighlight(s) {
    s.events.onInputOver.add(highlights(s), this);
    s.events.onInputOut.add(normalize(s),this);
    s.events.onInputDown.add(color(s), this);
}

//the dark blue (pressed down)
function color(s) {
    return function() {
        s.tint = 0x0000ff;
    }
}

//the light blue highlight
function highlights(s) {
    return function() {
        if (s.tint == 0xffffff) {
            s.tint = 0x009fff;
        }
    }
}

function normalize(s) {
    return function() {
        if (s.tint == 0x009fff){ 
            s.tint = 0xffffff;
        }
    }
}

function reset() {
    for (let x = 0;  x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            board[x][y].image.tint = 0xffffff
        }
    }
}

//to restart the game
function replay() {

}

var button1;
var button2;
var button3;
var group;
var box_size = 128; // for the menu item or tiles later on

function menuCreate(s) {
    return function() {
        console.log("Clicked:",s.x,s.y)
    
        if (group) {
            button1.destroy();
            button2.destroy();
            button3.destroy();
        }

        reset();

        group = game.add.group();

        button1 = game.make.button( 10 , 700, 'rotateClock' , clockwise, this, 20, 10, 0);
        button2 = game.make.button(140, 700, 'rotateCounter', counterClockWise, this, 20, 10, 0);
        button3 = game.make.button(270, 700, 'move', move, this, 20, 10, 0)
        function clockwise() {
            if (!rotated) {
                rotated = s.rotateClockWise();
            }
            removeGroup();

        }
        function counterClockWise() {
            if (!rotated) {
                rotated = s.rotateCounterClockWise();
            }
            removeGroup();
        }
        function move() {
            // Makes the player only be able to move after rotating
            if (!moved && rotated) {
                moved = movePlayer(s);
            }
            removeGroup();
        }


        function removeGroup() {
            button1.destroy();
            button2.destroy();
            button3.destroy();
            reset();
            game.world.remove(group);

        }


        addHighlight(button1);
        addHighlight(button2);
        addHighlight(button3);

        group.add(button1);
        group.add(button2);  
        group.add(button3);
    }
}
function checkGameStatus() {
    if (player.x == exit.x && player.y == exit.y) {
        console.log("You Win!");
    }
    if (playerPos.x == guardPos.x && playerPos.y == guardPos.y 
        && board[guardPos.x][guardPos.y].sameZone(player, guard)) {
        console.log("You Lose!");
        GameOver();
    }
}

function update() {
    checkGameStatus();
    if (rotated && moved) {
        moveGuard();
        checkGameStatus();
        rotated = false;
        moved = false;
    }

    player.x = game.world.centerX+(playerPos.x-1)*tileSize;
    player.y = game.world.centerY+(playerPos.y-2)*tileSize;
    player.bringToTop;

    guard.x = game.world.centerX+(guardPos.x-1)*tileSize;
    guard.y = game.world.centerY+(guardPos.y-2)*tileSize;
    guard.bringToTop;

}

function movePlayer(tile) {
    let x = playerPos.x;
    let y = playerPos.y;
    let xMove = tile.x - x;
    let yMove = tile.y - y;
    let changed = false;
    if (xMove == 0) {
        if (yMove == 1 && tile.canGoNorth(player,playerPos) && board[x][y].canGoSouth(player, playerPos)) {
            board[x][y].moveAway(player);
            playerPos.y += yMove;
            changed = true;
        }
        if (yMove == -1 && tile.canGoSouth(player, playerPos) && board[x][y].canGoNorth(player, playerPos)) {
            board[x][y].moveAway(player);
            playerPos.y += yMove;
            changed = true;
        }
    }
    else if (yMove == 0) {
        if (xMove == 1 && tile.canGoWest(player, playerPos) && board[x][y].canGoEast(player, playerPos)) {
            board[x][y].moveAway(player);
            playerPos.x += xMove;
            changed = true;
        }
        if (xMove == -1 && tile.canGoEast(player, playerPos) && board[x][y].canGoWest(player, playerPos)) {
            board[x][y].moveAway(player);
            playerPos.x += xMove;
            changed = true;
        }
    }
    if (changed) {
        tile.moveTo(player, xMove, yMove);
    }
    return changed;
}

function moveGuard() {
    let possibleMoves = [];
    let x = guardPos.x;
    let y = guardPos.y;
    if (y < board[x].length-1) {
        if (board[x][y+1].canGoNorth(guard, guardPos) && board[x][y].canGoSouth(guard, guardPos)) {
            possibleMoves.push({x:0,y:1, tile: board[x][y+1]});
        }
    }
    if (y > 0) {
        if (board[x][y-1].canGoSouth(guard, guardPos) && board[x][y].canGoNorth(guard, guardPos)) {
            possibleMoves.push({x:0,y:-1, tile: board[x][y-1]});
        }
    }
    if (x < board.length-1) {
        if (board[x+1][y].canGoWest(guard, guardPos) && board[x][y].canGoEast(guard, guardPos)) {
            possibleMoves.push({x:1,y:0, tile: board[x+1][ y]});
        }
    }
    if (x > 0) {
        if (board[x-1][y].canGoEast(guard, guardPos) && board[x][y].canGoWest(guard, guardPos)) {
            possibleMoves.push({x:-1,y:0, tile: board[x-1][y]});
        }
    }
    if (possibleMoves.length != 0) {
        let pickedMove = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
        board[ x][ y].moveAway(guard)
        guardPos.x += pickedMove.x;
        guardPos.y += pickedMove.y;
        pickedMove.tile.moveTo(guard, pickedMove.x, pickedMove.y);
    }
    
}
function findExits(tileName) {
    // 4 being the length of the word tile
    let index = tileName.slice("tile".length, tileName.length);
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
function findComboExits(tileName) {
    // 4 being the length of the word tile
    let index = tileName.slice("combo".length, tileName.length);
    switch(comboTileNames[index]) {
        case "Dead_End_2.png":
            return [1,0,2,0];
        case "Line_Combo.png":
            return [1,2,1,2];
        case "Loop_Tile_2.png":
            return [1,1,2,2];
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
        // Only creates image for tiles with sprites
        this.image = game.add.sprite(xLoc, yLoc, tileName);
        if (tileName != "") {
            
            this.image.anchor.setTo(0.5,0.5);
            this.image.inputEnabled = true;
            this.image.events.onInputDown.add(menuCreate(this), this);
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
    }
    canGoNorth (character) {
        return this.exits[(this.rotation/90)];
    }
    canGoWest (character) {
        return this.exits[(1+(this.rotation/90)) % 4];
    }
    canGoSouth (character) {
        return this.exits[(2+(this.rotation/90)) % 4];
    }
    canGoEast (character) {
        return this.exits[(3+(this.rotation/90)) % 4];
    }
    rotateClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == length+1) {
            return false;
        }
        this.rotation = (this.rotation + 90) % 360;
        this.image.angle += 90;
        return true;
        
    }
    rotateCounterClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == length+1) {
            return false;
        }
        this.rotation = (this.rotation + 270) % 360;
        this.image.angle -= 90;
        return true;
    }
    moveTo(character, x, y) {
        return;
    }
    moveAway(character, characterPos) {
        return;
    }
    sameZone(player, guard) {
        return true;
    }
}

class ComboTile {
    // Specifically represents a tile with two separate zones
    // exits : represent as an array of length 4
    //          North: Index 0,
    //          West:  Index 1,
    //          South: Index 2,
    //          East:  Index 3,
    //          With Value 2 at the index meaning there is an exit for zone 2
    //               Value 1 at the index meaning there is an exit for zone 1
    //               Value 0 meaning there isn't
    // rotation: keeps track of the rotation of the tile and is between 0 <= x <= 360

    constructor(exits, rotation, xLoc, yLoc, tileName, x, y) {
        this.zone1 = []
        this.zone2 = []
        this.x = x;
        this.y = y;
        // Only creates image for tiles with sprites
        this.image = game.add.sprite(xLoc, yLoc, tileName);
        if (tileName != "") {
            
            this.image.anchor.setTo(0.5,0.5);
            this.image.inputEnabled = true;
            this.image.events.onInputDown.add(menuCreate(this), this);
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
    }
    canGoDirection(character, characterPos, direction) {
        let isExit = this.exits[(direction+(this.rotation/90)) % 4]
        if (isExit == 0) {
            return false;
        } else if (characterPos.x == this.x && characterPos.y == this.y) {
            
            if (this.zone1.includes(character)) {
                return isExit == 1; // Should only return 1 when is Exit is 1
            } else if (this.zone2.includes(character)){
                return isExit == 2; // Should only return 1 when is Exit is 2
            } else {
                console.log("Error: Character is not in any zone");
            }
        } else {
            return isExit != 0 // Any exit is good when you're entering
        }
    }

    canGoNorth (character, characterPos) {
        return this.canGoDirection(character,characterPos, 0);
    }
    canGoEast (character, characterPos) {
        return this.canGoDirection(character, characterPos, 1);
    }
    canGoWest (character, characterPos) {
        return this.canGoDirection(character, characterPos, 3);
    }
    canGoSouth (character, characterPos) {
        return this.canGoDirection(character, characterPos, 2);
    }
    rotateClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == length+1) {
            return false;
        }
        this.rotation = (this.rotation + 90) % 360;
        this.image.angle += 90;
        return true;
        
    }
    rotateCounterClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == length+1) {
            return false;
        }
        this.rotation = (this.rotation + 270) % 360;
        this.image.angle -= 90;
        return true;
    }


    moveTo(character, x, y) {
         if (x == 0 && y == 1) { //Went to North Side
            if (this.exits[(0+(this.rotation/90)) % 4] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
         } else if (x == 0 && y == -1) { //Went to South
            if (this.exits[(2+(this.rotation/90)) % 4] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
        } else if (x == 1 && y == 0) {//Moved East
            if (this.exits[(1+(this.rotation/90)) % 4] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
        } else if (x == -1 && y == 0) { //Moved West
            if (this.exits[(3+(this.rotation/90)) % 4] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
        } else {
                console.log("Error, Player moved too much");
        }
        console.log(this.zone1);
        console.log(this.zone2);
        for (var x =0; x < 4; x++) {
            console.log(x, this.canGoDirection(player, playerPos, x))
        }
    }
    moveAway(character) {
        if (this.zone1.includes(character)) {
            this.zone1.splice(this.zone1.indexOf(character), 1);
        }
        else {
            this.zone2.splice(this.zone2.indexOf(character), 1);
        }
        console.log(this.zone1);
        console.log(this.zone2);
    }

    sameZone(player, guard) {
        return this.zone1.includes(player) == this.zone1.includes(guard) ||
               this.zone2.includes(player) == this.zone2.includes(guard);
    }
}


