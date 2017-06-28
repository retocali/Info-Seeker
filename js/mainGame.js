// Canvas size and scaling relative to screen size

var gameX = 1100;
var gameY = 800;
var canvas_x = window.innerWidth;
var canvas_y = window.innerHeight;
var scaleRatio = Math.min(canvas_x/gameX, canvas_y/gameY)*Math.pow(devicePixelRatio, 1/2);

var game = new Phaser.Game(canvas_x, canvas_y, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});

// Sound
var click;
var background;
var volume = 1; 
var youwin;
var muteBGM;

// Map related Variables
var board;
var entrance;
var exit;


// Characters on the screen
var player;
var guards = [];
var memoryTiles = [];


// Menu Variable
var text; // this text is for the memory tiles text
var memoryTaken;
var rectangle;
var memoryAmount = 0; //starts off with the amount of tiles collected
var steps = 0;
var finished = false;

//music found from https://www.dl-sounds.com/royalty-free/category/game-film/video-game/ && http://freesound.org
//https://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser source
//for the game over screen


// Various Screens
var gameDone;
var youWin
var logo;
var backgroundImage;

// For keeping tracking of turns
var moved = false;
var rotated = false;


// Constants to for the map 
var WIDTH = 3;
var LENGTH = 3;
var MEMORY_NUM = 2;
var COMBO_SPAWN = 0.1;


// Constants for checking directions
var RIGHT_ANGLE = 90;
var FLIPPED = 180;
var FULL_CIRCLE = 360;


// Filenames
var tiles = [];
var comboTiles = [];
var entrix = "EntranceExit.png";
var replayImage = "button_restart.png";
var comboTileNames = ["Dead_End_2.png","Line_Combo.png","Loop_Tile_2.png"];
var tileNames = ["Corner_Tile.png","Cross_Tile.png","DeadEnd_Tile.png", "Line_Tile.png","Tetris_Tile.png"];

// UI variables
var button1;
var button2;
var button3;
var group;
var cursorPos = {x:-1, y:-1};


// UI Constants
var TILE_SIZE = 150*scaleRatio;
var MARGIN = 12*scaleRatio;
var BOX_SIZE = 128*scaleRatio; 



// Keys 
var keyUp;
var keyLeft;
var keyDown;
var keyRight;
var keyZ;
var keyX;


// Directions
var NORTH = 0;
var WEST = 1;
var SOUTH = 2;
var EAST = 3;
var DIRECTIONS = 4;


/*
    Phaser Functions
*/

function preload() {
    // Used to load the background music, game over and win sounds, and UI sounds
    game.load.audio('bgm', 'assets/sounds/PuzzleTheme1.wav');
    game.load.audio('click', 'assets/sounds/click1.wav');
    game.load.audio('restartClick', 'assets/sounds/219472__jarredgibb__button-01.wav');
    game.load.audio('win!', 'assets/sounds/win.mp3');
    game.load.audio('lose', 'assets/sounds/gameover.wav');

    // Image for mute button
    game.load.image('mute', 'assets/sprites/mute.png');

    // Big Screens
    game.load.image('logo', 'assets/sprites/welcome.jpg');
    game.load.image('gameover', 'assets/sprites/gameover.png');
    game.load.image('youwin', 'assets/sprites/youwin.png');
    game.load.image('background', 'assets/sprites/12436668-torsion-movement-op-art-abstract-illustration.jpg');

    // Memory Tile 
    game.load.image('memoryTile', 'assets/sprites/memory_tile.gif');
    game.load.image('memoryBoard', 'assets/sprites/memory_board.jpg')

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

    makeBackground();

    boardGenerator();

    makePlayer();

    makeMemoryTiles();

    memoryBoardGenerator();

    backgroundMusic();

    makeUI();

    addKeyboardInput();

}

function backgroundMusic() {

    // Muting the BGM
    muteBGM = game.add.button(game.world.centerX + scaleRatio * 128*2.5, game.world.centerY + scaleRatio * 128, 'mute');
    muteBGM.scale.setTo(64*scaleRatio/muteBGM.width,64*scaleRatio/muteBGM.height);
    muteBGM.inputEnabled = true;
    muteBGM.bringToBottom;
    muteBGM.events.onInputDown.add(muteFunction,this);

    background = game.add.audio('bgm', volume, true);
    background.play();
    

}

// Mute function for the BGM
function muteFunction() {
    if (volume) {
        background.stop();
    } else {
        background.play();
    }
    volume = !volume;
}

function makeBackground() {
    // Sets up the background
    game.stage.backgroundColor = "#44aaaa";
    game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true; game.scale.refresh();

    backgroundImage = game.add.image(game.world.centerX, game.world.centerY, 'background');
    backgroundImage.anchor.setTo(0.5, 0.5);
    backgroundImage.scale.setTo(canvas_x/backgroundImage.width,canvas_y/backgroundImage.height);
    backgroundImage.bringToBottom;
    backgroundImage.tint = 0x224422;
}

function memoryBoardGenerator() {

    rectangle = game.add.sprite(game.world.centerX + 280*scaleRatio, game.world.centerY - 60*scaleRatio, "memoryBoard");
    rectangle.scale.setTo(scaleRatio*0.1,scaleRatio*0.10);

    text = game.add.text(game.world.centerX + 360*scaleRatio, game.world.centerY, "Memories: " + memoryAmount + "\n Steps: " + steps, {
        font: "20px Comic Sans",
        fill: "#ffffff",
        align: "center"
    });

    text.anchor.setTo(0.5, 0.5);
    text.scale.setTo(scaleRatio, scaleRatio);
}

var delta = 0;
function update() {

    if (finished) {
        return;
    } else {
        finished = checkGameStatus();
    }

    if (rotated && moved) {
        for(let n = 0; n < guards.length; n++) {
            if (!guards[n].active) {
                respawnGuard(n);
                guards[n].tint = 0xffffff;
                guards[n].active = true;
            } else {
                moveGuard(guards[n]);
            }
        }
        checkGameStatus();
        rotated = false;
        moved = false;
    }
    for (var n = 0; n < MEMORY_NUM; n++) {
        positionCharacter(guards[n])
        let memory = memoryTiles[n];
        if (memory.found) {
            memory.tint = 0x444444;
        }
        else {
            memory.tint = 0xffffff;
        }
    }

    // Move the characters to their proper screen position
    positionCharacter(player);

    // delta += 1;
    // if (delta == 20){
    //     chance = Math.floor(Math.random()*3);
    //     if (backgroundImage.tint - backgroundImage.tint < 0) {
    //         backgroundImage.tint = Math.floor(Math.random()*0xffffff)
    //     } else {
    //         backgroundImage.tint -= Math.pow(16,(2*chance));
    //     }
        
    //     delta = 0;
    // }
    // //backgroundImage.rotation += 0.001;
}


/* 
    Initializing Functions for the create function
*/
function boardGenerator() {
    // Creates the board
    board = [[],[],[]];
    for (let x = 0; x < WIDTH; x++) {
        

        for (let y = 0; y <= LENGTH + 1; y++) {
            // Finds the centered placement of the tiles 
            let s;
            
            // Sets up a random rotation for eachtile
            let rotation = Math.floor(Math.random()*DIRECTIONS)*RIGHT_ANGLE;
            if (x == 0 && y == 1) {
                rotation = 0; // Ignores the tile that is directly below the player at the start    
            }
            if (y == 0) {
                if (x == 0) {
                    //Creates the entrance
                    s = new BasicTile([0,0,1,0], 0, xLoc(x), yLoc(y), "entrix", x, y);
                    entrance = s;
                } else 
                    s = new BasicTile([0,0,0,0], 0, xLoc(x), yLoc(y), "", x, y);
            
            } else if (y == LENGTH + 1) {
                // Creates the exit
                if (x == WIDTH - 1) {
                    s = new BasicTile([0,0,1,0], FLIPPED, xLoc(x), yLoc(y), "entrix",x, y);
                    exit = s
                } else
                    s = new BasicTile([0,0,0,0], 0, xLoc(x), yLoc(y), "", x, y);

            } else if (Math.random() < COMBO_SPAWN) {
                let tileName = comboTiles[Math.floor(Math.random()*comboTiles.length)];
                s = new ComboTile(findComboExits(tileName), rotation, xLoc(x), yLoc(y), tileName, x, y);
            
            } else {
                // Creates the actual sprites and adds a handler to rotate it
                let tileName = tiles[Math.floor(Math.random()*tiles.length)];
                s = new BasicTile(findExits(tileName), rotation, xLoc(x), yLoc(y), tileName, x, y);
            }
            board[x][y] = s;
            s.image.scale.setTo(TILE_SIZE/s.image.width, TILE_SIZE/s.image.height);
        }
    }
}

function makePlayer() {

    // Creates the player
    player = game.add.sprite(xLoc(entrance.x), yLoc(entrance.y), 'player');
    player.pos = {x:entrance.x, y:entrance.y};
    player.anchor.setTo(0.5,0.5);
    player.inputEnabled = true;
    player.scale.setTo(scaleRatio,scaleRatio);

}

function makeUI() {

    //Creates the restart button
    restartButton = game.add.button(game.world.centerX + 300*scaleRatio, 100*scaleRatio+game.world.centerY-(gameY/2)*scaleRatio, 'replayImage', actionOnClick, this);
    restartButton.scale.setTo(0.41*scaleRatio,0.41*scaleRatio);
    restartButton.inputEnabled = true;

    //Splash screen
    logo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
    logo.anchor.setTo(0.5,0.5);
    logo.scale.setTo(0.18*scaleRatio,0.25*scaleRatio);
    logo.fixedtoCamera = true;
    logo.bringToTop;
    game.input.onDown.add(removeLogo, this);

    // Game Over screen
    gameDone = game.add.sprite(game.world.centerX, game.world.centerY, 'gameover');
    gameDone.scale.setTo(3.1*scaleRatio,3.5*scaleRatio);
    gameDone.anchor.setTo(0.5,0.5);
    gameDone.visible = false;

    // You Win! Screen
    youWin = game.add.sprite(game.world.centerX, game.world.centerY, 'youwin');
    youWin.scale.setTo(1.9*scaleRatio,1.7*scaleRatio);
    youWin.anchor.setTo(0.5,0.5);
    youWin.visible = false;
    youWin.inputEnabled = false;
}

function makeMemoryTiles() {

    // Make memory tiles
    posMemTilesLocs = [];
    
    for (let a = 0; a < WIDTH; a++) {
        for (let b = 1; b <= LENGTH; b++) {
            posMemTilesLocs.push({x:a,y:b});
        }
    }
    // Removes the chance that the tiles land adjacent to the player
    posMemTilesLocs.splice(LENGTH, 1);
    posMemTilesLocs.splice(1, 1);
    posMemTilesLocs.splice(0, 1);
    
    for (let i = 0; i < MEMORY_NUM; i++) {
        // Random indices on the board based on the locations
        let index = Math.floor(Math.random()*posMemTilesLocs.length);
        let coord = posMemTilesLocs[index];
        posMemTilesLocs.splice(index, 1)
        // Which translate to random locations
        let memoryTile = game.add.sprite(xLoc(coord.x), yLoc(coord.y), 'memoryTile');
        memoryTile.pos = {x: coord.x, y: coord.y};
        memoryTile.found = false;
        memoryTiles.push(memoryTile);
        memoryTile.anchor.setTo(0.5,0.5);
        memoryTile.scale.setTo(scaleRatio,scaleRatio);
        makeGuard(coord.x, coord.y);
        memoryTile.bringToTop();
    }

}

function makeGuard(xpos, ypos) {
    // Creates the Guard
    let guard = game.add.sprite(xLoc(xpos), yLoc(ypos), 'guard');
    guard.pos = {x: xpos, y: ypos};
    guard.anchor.setTo(0.5,0.5);
    guard.scale.setTo(scaleRatio,scaleRatio);
    guard.active = true;
    guards.push(guard);
    board[xpos][ypos].joinZone(guard);
}

function addKeyboardInput() {
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
    keyZ.onDown.add(rotateCounterClockWise, this);

    keyX = game.input.keyboard.addKey(Phaser.Keyboard.X);
    keyX.onDown.add(rotateClockWise, this);

    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);
}


/*
     Functions that allow actions through keyboard
*/

// Functions that allow actions through keyboard
function moveUp() {
    if (rotated && !moved && player.pos.y > 0) {
        moved = movePlayer(board[player.pos.x][player.pos.y-1]);
    } else if (!rotated && cursorPos.x == -1 && cursorPos.y == -1) {
        initializeCursor();
    } else if (!rotated && cursorPos.y > 1) {
        cursorPos.y--;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}

function moveDown() {
    if (rotated && !moved && player.pos.y < board[player.pos.x].length-1) {
        moved = movePlayer(board[player.pos.x][player.pos.y+1]);
    } else if (!rotated && cursorPos.x == -1 && cursorPos.y == -1) {
        initializeCursor();
    } else if (!rotated && cursorPos.y < board[player.pos.x].length-2) {
        cursorPos.y++;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}

function moveRight() {
    if (rotated && !moved && player.pos.x < board.length-1) {
        moved = movePlayer(board[player.pos.x+1][player.pos.y]);
    } else if (!rotated && cursorPos.x == -1 && cursorPos.y == -1) {
        initializeCursor();    
    } else if (!rotated && cursorPos.x < board.length-1) {
        cursorPos.x++;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}

function moveLeft() {
    if (rotated && !moved && player.pos.x > 0) {
        moved = movePlayer(board[player.pos.x-1][player.pos.y]);
    } else if (!rotated && cursorPos.x == -1 && cursorPos.y == -1) {
        initializeCursor();
    } else if (!rotated && cursorPos.x > 0) {
        cursorPos.x--;
        highlights(board[cursorPos.x][cursorPos.y].image)();
    }
}

function initializeCursor() {
    cursorPos.x = 0;
    cursorPos.y = 1;
    highlights(board[cursorPos.x][cursorPos.y].image)();
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



/*
    UI Functions
*/

// Keeps track of memory tiles collected
function updateText() {
    text.setText("Memories: " + memoryAmount + "\n" + "Steps: " + steps);

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
        click = game.add.audio('click', 0+volume);
        click.play();
        s.tint = 0x00ff00;
    }
}

// the light blue highlight
function highlights(s) {
    return function() {
        resetHighlight();
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

// Turns all highlight back to normal
function resetHighlight() {
    for (let x = 0;  x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (board[x][y].image.tint == 0x009fff) {
                board[x][y].image.tint = 0xffffff
            }
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

        var BUTTON_Y = game.world.centerY;
        var OFFSET = game.world.centerX-350*scaleRatio;


        if (group) {
            button1.destroy();
            button2.destroy();
            button3.destroy();
        }

        reset();

        group = game.add.group();

        button1 = game.make.button(OFFSET, BUTTON_Y+(BOX_SIZE+MARGIN), 'rotateClock' , clockwise, this, 20, 10, 0);
        button2 = game.make.button(OFFSET, BUTTON_Y, 'rotateCounter', counterClockWise, this, 20, 10, 0);
        button3 = game.make.button(OFFSET, BUTTON_Y-(BOX_SIZE+MARGIN), 'move', move, this, 20, 10, 0)
     
        button1.scale.setTo(scaleRatio,scaleRatio);
        button2.scale.setTo(scaleRatio,scaleRatio);
        button3.scale.setTo(scaleRatio,scaleRatio);

        button1.anchor.setTo(0.5,0.5);
        button2.anchor.setTo(0.5,0.5);
        button3.anchor.setTo(0.5,0.5);

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

// used with the splash screen
function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    //tried to use this to fade in/fade out the welcome...
    // game.add.tween(sprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    logo.kill();
}

// used with the restart button
function actionOnClick () {
    
    finished = false;
    player.pos = {x:entrance.x, y:entrance.y};
    for (let n = 0; n < memoryTiles.length; n++) {
        respawnGuard(n);
        guards[n].active = true;
        guards[n].tint = 0xffffff;
    }
    for (let x = 0;  x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            board[x][y].resetRotation();
        }
    }
    gameDone.visible = false;
    youWin.visible = false
    rotated = false;
    moved = false;
    steps = 0;
    memoryAmount = 0;
    for (let n = 0; n < MEMORY_NUM; n++) {
        memoryTiles[n].found = false;
    }
    click = game.add.audio('restartClick', volume);
    click.play();
    reset();
    updateText();
}

// To make the whole game replay
function replay() {
    actionOnClick();
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y <= LENGTH + 1; y++) {    
            board[x][y].image.destroy();
            delete board[x][y];
        }
    }
    boardGenerator();
    for (let n = 0; n < MEMORY_NUM; n++) {
        memoryTiles[n].destroy();
        guards[n].destroy();
    }
    guards = [];
    memoryTiles = [];
    makeMemoryTiles();
    player.destroy();
    makePlayer();
    actionOnClick();
}

/*
    Functions related to the movement characters
*/

// Trys to move the player and returns true if it does false othewise
function movePlayer(tile) {
    let x = player.pos.x;
    let y = player.pos.y;
    let xMove = tile.x - x;
    let yMove = tile.y - y;
    let changed = false;
    if (xMove == 0) {
        if (yMove == 1 && tile.canGoNorth(player) && board[x][y].canGoSouth(player)) {            
            player.pos.y += yMove;
            changed = true;
        }
        if (yMove == -1 && tile.canGoSouth(player) && board[x][y].canGoNorth(player)) {
            player.pos.y += yMove;
            changed = true;
        }
    }
    else if (yMove == 0) {
        if (xMove == 1 && tile.canGoWest(player) && board[x][y].canGoEast(player)) {
            player.pos.x += xMove;
            changed = true;
        }
        if (xMove == -1 && tile.canGoEast(player) && board[x][y].canGoWest(player)) {
            player.pos.x += xMove;
            changed = true;
        }
    }
    if (changed) {
        board[x][y].moveAway(player);
        tile.moveTo(player, xMove, yMove);
        steps++;
        checkMemoryTiles();
        updateText();
    }
    return changed;
}

// The bodyguard AI
function moveGuard(guard) {
    let possibleMoves = possibleMovements(guard);
    if (possibleMoves.length != 0) {
        let pickedMove = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
        board[guard.pos.x][guard.pos.y].moveAway(guard)
        guard.pos.x += pickedMove.x;
        guard.pos.y += pickedMove.y;
        pickedMove.tile.moveTo(guard, pickedMove.x, pickedMove.y);
    } else {
        guard.active = false;
        guard.tint = 0x444444;
    }
    
}

function possibleMovements(character){
    let possibleMoves = [];
    let x = character.pos.x;
    let y = character.pos.y;
    if (y < board[x].length-1) {
        if (board[x][y+1].canGoNorth(character) && board[x][y].canGoSouth(character)) {
            possibleMoves.push({x:0,y:1, tile: board[x][y+1]});
        }
    }
    if (y > 0) {
        if (board[x][y-1].canGoSouth(character) && board[x][y].canGoNorth(character)) {
            possibleMoves.push({x:0,y:-1, tile: board[x][y-1]});
        }
    }
    if (x < board.length-1) {
        if (board[x+1][y].canGoWest(character) && board[x][y].canGoEast(character)) {
            possibleMoves.push({x:1,y:0, tile: board[x+1][ y]});
        }
    }
    if (x > 0) {
        if (board[x-1][y].canGoEast(character) && board[x][y].canGoWest(character)) {
            possibleMoves.push({x:-1,y:0, tile: board[x-1][y]});
        }
    }
    return possibleMoves;
}


/*
    Classes used for the tiles
*/

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
            this.image.angle = rotation;
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
        this.initialRotation = rotation;
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
        this.rotation = (this.rotation - RIGHT_ANGLE + FULL_CIRCLE) % FULL_CIRCLE;
        this.image.angle -= RIGHT_ANGLE;
        return true;
    }
    moveTo(character, x, y) {
        return;
    }
    moveAway(character) {
        return;
    }
    sameZone(player, guard) {
        return true;
    }
    joinZone(character) {
        return;
    }
    resetRotation() {
        this.image.angle = this.initialRotation;
        this.rotation = this.initialRotation
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
            this.image.angle = rotation;
            addHighlight(this.image);
        }
        this.exits = exits;
        this.rotation = rotation;
        this.initialRotation = rotation;
    }
    canGoDirection(character, direction) {
        let isExit = this.exits[(direction+(this.rotation/RIGHT_ANGLE)) % 4]
        if (isExit == 0) {
            return false;
        } else if (character.pos.x == this.x && character.pos.y == this.y) {
            
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
    canGoNorth (character) {
        return this.canGoDirection(character, NORTH);
    }
    canGoWest (character) {
        return this.canGoDirection(character, WEST);
    }
    canGoSouth (character) {
        return this.canGoDirection(character, SOUTH);
    }
    canGoEast (character) {
        return this.canGoDirection(character, EAST);
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
    joinZone(character) {
        if (character.zone) {
            if (character.zone == 1) {
                this.zone1.push(character);    
            } else {
                this.zone2.push(character);

            }
        }
        else if (Math.random > 0.5) {
            this.zone1.push(character);
            character.zone = 1;
        } else {
            this.zone2.push(character);
            character.zone = 2;
        }
    }
    resetRotation() {
        this.image.angle = this.initialRotation;
        this.rotation = this.initialRotation
    }
}


/*
    Helper functions to shorten code/ make it readable
*/
// Both return the coordinate value for the board index values
function xLoc(x) {
    return game.world.centerX+(x-1)*(TILE_SIZE+MARGIN);
}

function yLoc(y) {
    return game.world.centerY+(y-2)*(TILE_SIZE+MARGIN);
}

// positions character on the screen
function positionCharacter(character) {
    character.x = xLoc(character.pos.x);
    character.y = yLoc(character.pos.y);
    character.bringToTop;
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

// Used to check if the player has won or lost
function checkGameStatus() {


    
        
    for (var n = 0;  n < guards.length; n++) {
        let guard = guards[n];

        if (player.pos.x == guard.pos.x && player.pos.y == guard.pos.y 
            && board[guard.pos.x][guard.pos.y].sameZone(player, guard)) {
            console.log("You Lose!");
            youlose = game.add.audio('lose', volume, false);
            youlose.play();
            gameDone.bringToTop;  
            gameDone.visible = true;
            return true;

        } else if (player.pos.x == exit.x && player.pos.y == exit.y && memoryAmount == MEMORY_NUM) {
            console.log("You Win!");
            // if its played at update, it's gonna keep playing it.... causing a bug :/
            
            youwin = game.add.audio('win!',volume, false);
            youwin.play();
            youWin.bringToTop;
            youWin.visible = true;
            youWin.inputEnabled = true;
            youWin.events.onInputDown.add(replay,this);
            return true;
        }
    }
    if (possibleMovements(player).length == 0) {
        console.log("You Lose!");
        youlose = game.add.audio('lose', volume, false);
        youlose.play();
        gameDone.bringToTop;
        gameDone.visible = true;
        return true;
    }
    return false;
}

// Checks if the player has reached a memory tile
function checkMemoryTiles() {
    for (let n = 0; n < MEMORY_NUM; n++) {
        let x = memoryTiles[n].pos.x;
        let y = memoryTiles[n].pos.y;
        let found = memoryTiles[n].found;
        if (player.pos.x == x && player.pos.y == y && !found) {
            memoryAmount++;
            memoryTiles[n].found = true;
            updateText();
        }
    }
}

// Respawns the guard in their corresponding memory tile
function respawnGuard(n) {
    let xpos = memoryTiles[n].pos.x;
    let ypos = memoryTiles[n].pos.y;
    guards[n].pos = {x: xpos, y: ypos};
    board[xpos][ypos].joinZone(guards[n]);
}

function rgbToHex(r, g, b) {
    return r*Math.pow(16,4)+g*Math.pow(16,2)+b;

}