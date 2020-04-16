ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.twopointfive.game',	
	
	'plugins.touch-button',
	'plugins.touch-field',
	'plugins.gamepad',

	'game.levels.dungeon',
	'game.entities.oldman',

	'game.title',
	'game.hud'

	// ,'plugins.twopointfive.debug'
)
.defines(function(){ "use strict";
	

var MyGame = tpf.Game.extend({
	sectorSize: 4,
	hud: null,

	dead: false,
	menu: null,

	gravity: 4,

	// Zelda Song :)
	music: new ig.Sound("media/music/Labyrinth.*"),
	
	init: function() {
		// Setup HTML Checkboxes and mouse lock on click
		if( !ig.ua.mobile ) {

			ig.system.canvas.addEventListener('click', function(){
				ig.system.requestMouseLock();
			});
		}
		
		// Setup Controls
		ig.input.bind( ig.KEY.MOUSE1, 'click' );

		this.setupDesktopControls(); 
		// Show Title Screen
		this.setTitle();
	},

	setTitle: function() {
		this.menu = new MyTitle();
	},

	setGame: function() {

		// Basic init setup

		this.menu = null;
		this.dead = false;
		this.hud = new MyHud( 640, 480 );
		// Load Dungeon
		this.loadLevel( LevelDungeon );

		// Zelda Music
		this.music.volume = 0.4;
		this.music.loop = true;
		//this.music.play();
	},
	
	setupDesktopControls: function() {
		// Setup keyboard & mouse controls
		ig.input.bind( ig.KEY.UP_ARROW, 'forward' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'back' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

		ig.input.bind( ig.KEY.ESC, 'pause' );
		
		ig.input.bind( ig.KEY.W, 'forward' );
		ig.input.bind( ig.KEY.A, 'stepleft' );
		ig.input.bind( ig.KEY.S, 'back' );
		ig.input.bind( ig.KEY.D, 'stepright' );
		
		ig.input.bind( ig.KEY.MOUSE2, 'run' );
		ig.input.bind( ig.KEY.MWHEEL_UP, 'weaponNext' );
		ig.input.bind( ig.KEY.MWHEEL_DOWN, 'weaponPrev' );

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

		// Remember the floor map, so we know where we can spawn entities
		this.floorMap = this.getMapByName('floor');
	},

	
	update: function() {
		// Reset tracking position for WebVR on button press
		if( ig.input.pressed('reset-tracking') && ig.system.renderer instanceof tpf.StereoRenderer ) {
			ig.system.renderer.reset();
		}

		if( this.menu ) {
			// If we have a menu don't update anything else
			this.menu.update();
			return;
		}
		
		if( this.dead ) {
			// Wait for keypress if we are dead
			if( ig.input.released('shoot') || (!ig.ua.mobile && ig.input.released('click')) ) {
				this.setTitle();
			}
		}

		// Update all entities and backgroundMaps
		this.parent();
		
		// Roll the death animation; just move the camera down a bit.
		if( this.deathAnimTimer ) {
			var delta = this.deathAnimTimer.delta();
			if( delta < 0 ) {
				ig.system.camera.position[1] = delta.map(
					-this.deathAnimTimer.target, 0,
					0, -ig.game.collisionMap.tilesize / 4
				);
			}
			else {
				this.deathAnimTimer = null;
				this.dead = true;
			}
		}
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


var width = 640;
var height = 480;


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