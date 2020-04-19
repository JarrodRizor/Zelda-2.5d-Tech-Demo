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

	gravity: 2,

	// Zelda Song :)
	music: new ig.Sound("media/music/Labyrinth.*"),
	gravity: 2,
	
	init: function() {
		// Setup HTML Checkboxes and mouse lock on click
		if( !ig.ua.mobile ) {
			// ig.$('#requestFullscreen').addEventListener('click', function( ev ) {
			// 	ig.system.requestFullscreen();
			// 	ev.preventDefault();
			// 	this.blur();
			// 	return false;
			// },false);

			// ig.$('#riftStereoMode').addEventListener('change', function( ev ) {
			// 	ig.system.setStereoMode(ev.target.checked);
			// 	ev.preventDefault();
			// 	this.blur();
			// 	return false;
			// },false);

			// if( ig.$('#riftStereoMode').checked ) {
			// 	ig.system.setStereoMode(true);
			// }

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
		// Setup keyboard & mouse controls
		ig.input.bind( ig.KEY.UP_ARROW, 'forward' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'back' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		
		ig.input.bind( ig.KEY.C, 'shoot' );
		ig.input.bind( ig.KEY.ENTER, 'shoot' );
		ig.input.bind( ig.KEY.V, 'weaponNext' );

		ig.input.bind( ig.KEY.ESC, 'pause' );
		
		ig.input.bind( ig.KEY.W, 'forward' );
		ig.input.bind( ig.KEY.A, 'stepleft' );
		ig.input.bind( ig.KEY.S, 'back' );
		ig.input.bind( ig.KEY.D, 'stepright' );
		
		ig.input.bind( ig.KEY.CTRL, 'shoot' );
		
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
		
		if( this.dead ) {
			if( ig.input.released('shoot') ) {
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

	
	showDeathAnim: function() {
		this.deathAnimTimer = new ig.Timer( 1 );
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

	// Listen to the window's 'resize' event and set the canvas' size each time
	// it changes.
	// Wait 16ms, because iOS might report the wrong window size immediately
	// after rotation.
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