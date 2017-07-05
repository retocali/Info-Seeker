var loadState = {
    preload: function() {
        game.load.bitmapFont('zigFont', 'assets/zig/font/font.png','assets/zig/font/font.fnt');

        var loadingMessage = game.add.text(game.world.centerX, game.world.centerY, "Loading ...");
        
        game.load.image('logo', 'assets/sprites/menus/welcome.jpg');

        loadingMessage.text = "Loading Sounds ...";
        // Used to load the background music, game over and win sounds, and UI sounds
        game.load.audio('bgm', 'assets/sounds/PuzzleTheme1.wav');
        game.load.audio('click', 'assets/sounds/click1.wav');
        game.load.audio('restartClick', 'assets/sounds/219472__jarredgibb__button-01.wav');
        game.load.audio('win!', 'assets/sounds/win.mp3');
        game.load.audio('lose', 'assets/sounds/gameover.wav');

        loadingMessage.text = "Loading UI ...";
        // Buttons
        game.load.spritesheet('buttons', "assets/sprites/buttons/buttons.png", 200, 200, 8);
        game.load.image('memoryBoard', 'assets/sprites/buttons/memory_board.jpg')
        game.load.image('replayImage',"assets/sprites/buttons/button_restart.png");

        // Big Screens

        game.load.image('gameover', 'assets/sprites/menus/gameover.png');
        game.load.image('youwin', 'assets/sprites/menus/youwin.png');
        game.load.image('background', 'assets/sprites/menus/background.jpg');
        game.load.image('helpScreen','assets/sprites/menus/help.jpg');
        game.load.image('creditPage', "assets/sprites/menus/credits.jpg");

        loadingMessage.text = "Loading Sprites ...";
        // Fonts    
        // The sprite for the player
        game.load.image('memoryTile', 'assets/sprites/characters/puzzle.png');
        game.load.image('player', "assets/sprites/characters/Player.png");
        game.load.image('guard', "assets/sprites/characters/Guard.png");
        

        // Used to load entrance/exit and restart button/instructions
        game.load.image('entrix',"assets/sprites/tiles/EntranceExit.png");
        

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
    },
    create: function() {
        console.log("Loaded!");
        game.state.start('main');
    }

};