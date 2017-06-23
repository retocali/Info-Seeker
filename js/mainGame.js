var canvas_x = window.innerWidth;
var canvas_y = window.innerHeight;
var scaleRatio = Math.min(canvas_x/1100, canvas_y/800)/window.devicePixelRatio;

console.log(window.devicePixelRatio);

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
var memoryTile;

//music found from https://www.dl-sounds.com/royalty-free/category/game-film/video-game/ && http://freesound.org
//https://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser source
//for the game over screen


// For keeping tracking of turns
var moved = false;
var rotated = false


// Constants to for the map 
var WIDTH = 3;
var LENGTH = 3;
var TILE_SIZE = 128*scaleRatio;
var MARGIN = 12*scaleRatio;
var COMBO_SPAWN = 0.1;
var RIGHT_ANGLE = 90;
var FLIPPED = 180;
var FULL_CIRCLE = 360;

// Counter for creating the map
var counter = 0;
memoryCount = 0;

// Filenames
var tiles = [];
var comboTiles = []
var entrix = "EntranceExit.png";
var replayImage = "button_restart.png"
var comboTileNames = ["Dead_End_2.png","Line_Combo.png","Loop_Tile_2.png"];
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png", "Line_Tile.png","Tetris_Tile.png"];

// UI variables
var button1;
var button2;
var button3;
var group;
var BOX_SIZE = 128*scaleRatio; 
var BUTTON_Y = 700*scaleRatio;
var cursorPos = {x:-1, y:-1};

// Keys 
var keyUp;
var keyLeft;
var keyDown;
var keyRight;

// Directions
var NORTH = 0;
var WEST = 1;
var SOUTH = 2;
var EAST = 3;
var DIRECTIONS = 4;


// Phaser Functions
function preload() {
    
    // Used to load GAME OVER 
    game.load.image('gameover', 'assets/sprites/gameover.png');

    // Splash Screen
    game.load.image('logo', 'assets/sprites/welcome.jpg');

    // Memory Tile 
    game.load.image('memoryTile', 'assets/sprites/memory_tile.gif');

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

    //game.scale = 0.5;
    game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true; game.scale.refresh();
    board = [[],[],[]];

    // Creates the board
    for (let x = 0; x < WIDTH; x++) {
        

        for (let y = 0; y <= LENGTH + 1; y++) {

            // Puts down the memory images
            // counter = counter + 1;

            // if (counter > 2 || counter != 4 ) {
            //     if (memoryCount < 3) {
            //         if (between(0, 3) == 0){
            //             // game.add.sprite();
            //             memoryCount = memoryCount + 1;
            //         }
            //     }
            // }

            // TODO: Tweak this to actually center it
            // Finds the centered placement of the tiles 
            let xLoc = game.world.centerX+(x-1)*(TILE_SIZE+MARGIN);
            let yLoc = game.world.centerY+(y-2)*(TILE_SIZE+MARGIN);
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
            else if (y == LENGTH + 1) {
                // Creates the exit
                if (x == WIDTH - 1) {
                    s = new BasicTile([0,0,1,0], FLIPPED, xLoc, yLoc, "entrix",x, y);
                    s.image.scale.y *= -1;
                    exit = s
                } else {
                    s = new BasicTile([0,0,0,0], 0, xLoc, yLoc, "", x, y);
                }
            } else if (Math.random() < COMBO_SPAWN) {
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

    // Make memory tiles
    var amount = 300;
    for (let g = 0; g < 9; g++) {
        if (counter > 2 || counter != 4 ) {
            if (memoryCount < 2) {
                if ( Math.floor(Math.random()*4) == 2) {
                    memoryTile = game.add.sprite(amount, amount, 'memoryTile');
                    amount = amount + 100;
                    memoryCount = memoryCount + 1;
                }
            }
        }
    }


    // Creates the Guard

    guard = game.add.sprite(game.world.centerX+TILE_SIZE+MARGIN, game.world.centerY+TILE_SIZE+MARGIN, 'guard');
    guardPos = {x:exit.x, y:exit.y}
    guard.anchor.setTo(0.5,0.5);
    guard.scale.setTo(scaleRatio,scaleRatio);
    // Creates the player
    player = game.add.sprite(game.world.centerX-TILE_SIZE+MARGIN, game.world.centerY-(LENGTH-1)*(TILE_SIZE+MARGIN), 'player');
    playerPos = {x:entrance.x, y:entrance.y}
    player.anchor.setTo(0.5,0.5);
    player.inputEnabled = true;
    player.scale.setTo(scaleRatio,scaleRatio);

    //Creates the restart button
    restartButton = game.add.button(game.world.centerX + 300*scaleRatio, 100*scaleRatio, 'replayImage', actionOnClick, this);
    restartButton.scale.setTo(0.41*scaleRatio,0.41*scaleRatio);
    restartButton.inputEnabled = true;

    //Splash screen
    logo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
    logo.anchor.setTo(0.5,0.5);
    logo.scale.setTo(0.18*scaleRatio,0.25*scaleRatio);
    logo.fixedtoCamera = true;
    game.input.onDown.add(removeLogo, this);

    // Adds keyboard input
    keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    keyUp.onDown.add(moveUp, this);

    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyLeft.onDown.add(moveLeft, this);

    keyRight= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    keyRight.onDown.add(moveRight, this);

    keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keyDown.onDown.add(moveDown, this);

    keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    keyZ.onDown.add(rotateClockWise, this);

    keyX = game.input.keyboard.addKey(Phaser.Keyboard.X);
    keyX.onDown.add(rotateCounterClockWise, this);

    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);

    // Game Over screen
    gameDone = game.add.sprite(0, 0, 'gameover');
    gameDone.scale.setTo(3.1*scaleRatio,3.5*scaleRatio);
    gameDone.visible = false;
}

function update() {
    checkGameStatus();
    if (rotated && moved) {
        moveGuard();
        checkGameStatus();
        rotated = false;
        moved = false;
        //reset();
    }
    gameDone.bringToTop;

    player.x = game.world.centerX+(playerPos.x-1)*(TILE_SIZE+MARGIN);
    player.y = game.world.centerY+(playerPos.y-2)*(TILE_SIZE+MARGIN);
    player.bringToTop;

    guard.x = game.world.centerX+(guardPos.x-1)*(TILE_SIZE+MARGIN);
    guard.y = game.world.centerY+(guardPos.y-2)*(TILE_SIZE+MARGIN);
    guard.bringToTop;
}


// Functions that allow actions through keyboard
function moveUp() {
    if (rotated && !moved && playerPos.y > 0) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        moved = movePlayer(board[playerPos.x][playerPos.y-1]);
    } else if (!rotated && cursorPos.y == -1) {
        cursorPos.x = 0;
        cursorPos.y = 1;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    } else if (!rotated && cursorPos.y > 1) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        cursorPos.y--;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}
function moveDown() {
    if (rotated && !moved && playerPos.y < board[playerPos.x].length-1) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        moved = movePlayer(board[playerPos.x][playerPos.y+1]);
    } else if (!rotated && cursorPos.y == -1) {
        cursorPos.x = 0;
        cursorPos.y = 1;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    } else if (!rotated && cursorPos.y < board[playerPos.x].length-2) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        cursorPos.y++;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}
function moveRight() {
    if (rotated && !moved && playerPos.y < board.length-1) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        moved = movePlayer(board[playerPos.x+1][playerPos.y]);
    } else if (!rotated && cursorPos.y == -1) {
        cursorPos.x = 0;
        cursorPos.y = 1;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    } else if (!rotated && cursorPos.x < board.length-1) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        cursorPos.x++;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}
function moveLeft() {
    if (rotated && !moved && playerPos.x > 0) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        moved = movePlayer(board[playerPos.x-1][playerPos.y]);
    } else if (!rotated && cursorPos.y == -1) {
        cursorPos.x = 0;
        cursorPos.y = 1;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    } else if (!rotated && cursorPos.x > 0) {
        normalize(board[cursorPos.x][cursorPos.y].image)();
        cursorPos.x--;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}
function rotateClockWise() {
    if (!rotated && cursorPos.x != -1) {
        board[cursorPos.x][cursorPos.y].rotateClockWise();
        rotated = true;
    }
}
function rotateCounterClockWise() {
    if (!rotated && cursorPos.x != -1) {
        board[cursorPos.x][cursorPos.y].rotateCounterClockWise();
        rotated = true;
    }
}


// used with the splash screen
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
    gameDone.visible = false;
    rotated = false;
    moved = false;
    gameDone.destroy();
    // game.input.onDown.add(actionOnClick,self);
    exit.rotation = FLIPPED;
    reset();
}

// call this function when the player loses
function GameOver () {
    gameDone.visible = true;
}

// Makes the buttons change color over various mouse inputs
function addHighlight(s) {
    s.events.onInputOver.add(highlights(s), this);
    s.events.onInputOut.add(normalize(s),this);
    s.events.onInputDown.add(color(s), this);
}

// the dark blue (pressed down)
function color(s) {
    return function() {
        s.tint = 0x0000ff;
    }
}

// the light blue highlight
function highlights(s) {
    return function() {
        if (s.tint == 0xffffff) {
            s.tint = 0x009fff;
        }
    }
}

// Turns the hover tiles to normal
function normalize(s) {
    return function() {
        if (s.tint == 0x009fff){ 
            s.tint = 0xffffff;
        }
    }
}

// Turns all tiles back to normal color
function reset() {
    for (let x = 0;  x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            board[x][y].image.tint = 0xffffff
        }
    }
}

// Creates the UI for the tiles
function menuCreate(s) {
    return function() {
        //console.log("Clicked:",s.x,s.y)
    
        if (group) {
            button1.destroy();
            button2.destroy();
            button3.destroy();
        }

        reset();

        group = game.add.group();

        button1 = game.make.button(MARGIN, BUTTON_Y, 'rotateClock' , clockwise, this, 20, 10, 0);
        button2 = game.make.button(2*MARGIN+BOX_SIZE, BUTTON_Y, 'rotateCounter', counterClockWise, this, 20, 10, 0);
        button3 = game.make.button(3*MARGIN+2*BOX_SIZE, BUTTON_Y, 'move', move, this, 20, 10, 0)

        button1.scale.setTo(scaleRatio,scaleRatio);
        button2.scale.setTo(scaleRatio,scaleRatio);
        button3.scale.setTo(scaleRatio,scaleRatio);


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

// Used to check if the player has won or lost
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

// Trys to move the player and returns true if it does false othewise
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

// The guard AI
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

// Finds the exits for the various tiles
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

// Finds the exits for the various combotiles
function findComboExits(tileName) {
    // 4 being the length of the word tile
    let index = tileName.slice("combo".length, tileName.length);
    switch(comboTileNames[index]) {
        case "Dead_End_2.png":
            return [1,0,2,0];
        case "Line_Combo.png":
            return [1,2,1,2];
        case "Loop_Tile_2.png":
            return [1,2,2,1];
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
            this.image.scale.setTo(scaleRatio,scaleRatio);
            this.image.inputEnabled = true;
            this.image.events.onInputDown.add(menuCreate(this), this);
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
    }
    canGoNorth (character) {
        return this.exits[(NORTH+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS];
    }
    canGoWest (character) {
        return this.exits[(WEST+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS];
    }
    canGoSouth (character) {
        return this.exits[(SOUTH+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS];
    }
    canGoEast (character) {
        return this.exits[(EAST+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS];
    }
    rotateClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == LENGTH+1) {
            return false;
        }
        this.rotation = (this.rotation + RIGHT_ANGLE) % FULL_CIRCLE;
        this.image.angle += RIGHT_ANGLE;
        return true;
        
    }
    rotateCounterClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == LENGTH+1) {
            return false;
        }
        this.rotation = (this.rotation - RIGHT_ANGLE) % FULL_CIRCLE;
        this.image.angle -= RIGHT_ANGLE;
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
            this.image.scale.setTo(scaleRatio,scaleRatio);
            this.image.inputEnabled = true;
            this.image.events.onInputDown.add(menuCreate(this), this);
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
    }
    canGoDirection(character, characterPos, direction) {
        let isExit = this.exits[(direction+(this.rotation/RIGHT_ANGLE)) % 4]
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
            return isExit != 0; // Any exit is good when you're entering
        }
    }

    canGoNorth (character, characterPos) {
        return this.canGoDirection(character,characterPos, NORTH);
    }
    canGoWest (character, characterPos) {
        return this.canGoDirection(character, characterPos, WEST);
    }
    canGoSouth (character, characterPos) {
        return this.canGoDirection(character, characterPos, SOUTH);
    }
    canGoEast (character, characterPos) {
        return this.canGoDirection(character, characterPos, EAST);
    }
    rotateClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == LENGTH+1) {
            return false;
        }
        this.rotation = (this.rotation + RIGHT_ANGLE) % FULL_CIRCLE;
        this.image.angle += RIGHT_ANGLE;
        return true;
        
    }
    rotateCounterClockWise() {
        // Escape for exit/entrance
        if (this.y == 0 || this.y == LENGTH+1) {
            return false;
        }
        this.rotation = (this.rotation - RIGHT_ANGLE + FULL_CIRCLE) % FULL_CIRCLE;
        this.image.angle -= RIGHT_ANGLE;
        return true;
    }


    moveTo(character, x, y) {
         if (x == 0 && y == 1) { //Went to North Side
            if (this.exits[(NORTH+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
        } else if (x == 1 && y == 0) { //Moved West
            if (this.exits[(WEST+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
         } else if (x == 0 && y == -1) { //Went to South
            if (this.exits[(SOUTH+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }
        } else if (x == -1 && y == 0) {//Moved East
            if (this.exits[(EAST+(this.rotation/RIGHT_ANGLE)) % DIRECTIONS] == 1) {
                this.zone1.push(character);
            } else {
                this.zone2.push(character);
            }

        } else {
                console.log("Error, Player moved too much");
        }

    }
    moveAway(character) {
        if (this.zone1.includes(character)) {
            this.zone1.splice(this.zone1.indexOf(character), 1);
        }
        else {
            this.zone2.splice(this.zone2.indexOf(character), 1);
        }
    }

    sameZone(player, guard) {
        return this.zone1.includes(player) == this.zone1.includes(guard) ||
               this.zone2.includes(player) == this.zone2.includes(guard);
    }
}


