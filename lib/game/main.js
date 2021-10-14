ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'plugins.twopointfive.game',	
	
	'plugins.touch-button',
	'plugins.touch-field',
	'plugins.gamepad',

	'game.levels.dungeon',

	'game.title',
	'game.hud'

	//,'plugins.twopointfive.debug'
)
.defines(function(){ "use strict";
	
var MyGame = tpf.Game.extend({
	sectorSize: 4,
	hud: null,

	dead: false,
	menu: null,
	fps: 60,
	gravity: 2,

	// Zelda Song :)
	music: new ig.Sound("media/music/Labyrinth.*"),
	gravity: 2,
	
	init: function() {
		// Setup HTML Checkboxes and mouse lock on click
		if( !ig.ua.mobile ) {
			ig.system.canvas.addEventListener('click', function(){
				ig.system.requestMouseLock();
			});
		}
		
		// Setup Controls
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		if( ig.ua.mobile ) { 
			this.setupTouchControls(); 
		}
		else { 
			this.setupDesktopControls(); 
		}	

		this.setTitle();
	},

	setTitle: function() {
		this.menu = new MyTitle();
	},

	setGame: function() {
		this.menu = null;
		this.dead = false;
		this.hud = new MyHud( 1280, 720 );

		// Zelda Music
		this.music.volume = 0.4;
		this.music.loop = true;
		this.music.play();

		// Load Dungeon
		this.loadLevel( LevelDungeon );
	},
	
	setupDesktopControls: function() {
		// Arrows
		ig.input.bind( ig.KEY.UP_ARROW, 'forward' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'stepleft' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'back' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'stepright' );
		//Pause
		ig.input.bind( ig.KEY.ESC, 'pause' );
		// AWSD
		ig.input.bind( ig.KEY.W, 'forward' );
		ig.input.bind( ig.KEY.A, 'stepleft' );
		ig.input.bind( ig.KEY.S, 'back' );
		ig.input.bind( ig.KEY.D, 'stepright' );
				
	},

	loadLevel: function( data ) {
		this.lastLevel = data;
		this.clearColor = null;

		// Find the info entity
		var info = null;
		for( var i = 0; i < data.entities.length; i++ ) {
			if( data.entities[i].settings && data.entities[i].settings.name == 'info' ) {
				info = data.entities[i].settings;
			}
		}

		// Use the sector size specified in the info entity or default (4)
		this.sectorSize = (info && info.sectorSize) || 4;

		// Load the map
		this.parent( data );

		// Set the fog and fog color (never use fog on mobile)
		if( info && typeof info.fogColor !== 'undefined' && !ig.ua.mobile ) {
			ig.system.renderer.setFog( parseInt(info.fogColor), info.fogNear, info.fogFar );
		}
		else {
			ig.system.renderer.setFog( false );
		}

		// Remember the floor map, so we know where we can spawn entities
		this.floorMap = this.getMapByName('floor');
	},

	
	update: function() {

		if( this.menu ) {
			this.menu.update();
			return;
		}
		this.parent();
	},


	drawWorld: function() {
		this.parent();
	},

	drawHud: function() {
		ig.system.renderer.hudFreelook = false;
		if( this.player ) {
			ig.game.hud.draw(this.player, this.player.currentWeapon);
		}

		if( this.menu ) {
			ig.system.renderer.hudFreelook = true;
			this.menu.draw();
		}
	}
});


document.body.className = 
	(ig.System.hasWebGL() ? 'webgl' : 'no-webgl') + ' ' +
	(ig.ua.mobile ? 'mobile' : 'desktop');


var width = 1280;
var height = 720;

if( window.Ejecta ) {
	var canvas = ig.$('#canvas');
	width = window.innerWidth;
	height = window.innerHeight;
	
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
}
else if( ig.ua.mobile ) {
	ig.$('#game').className = 'mobile';
	var canvas = ig.$('#canvas');

	window.addEventListener('resize', function(){ setTimeout(function(){
		if( ig.system ) { ig.system.resize( window.innerWidth, window.innerHeight ); }
		if( ig.game ) { ig.game.setupTouchControls(); }
	}, 16); }, false);

	width = window.innerWidth;
	height = window.innerHeight;
}


ig.Sound.use = [ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.M4A];

// Test WebGL support and init
if( ig.System.hasWebGL() ) {
	ig.main( '#canvas', MyGame, 60, width, height, 1, tpf.Loader );
}
else {
	ig.$('#game').style.display = 'none';
	ig.$('#no-webgl').style.display = 'block';
}

});