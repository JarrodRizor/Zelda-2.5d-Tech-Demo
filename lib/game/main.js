ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'plugins.twopointfive.game'
)
.defines(function(){ "use strict";

var MyGame = tpf.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	gravity: 4,
	
	init: function() {
		
		// Setup Controls
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		this.setupDesktopControls(); 

	},	
	setupDesktopControls: function() {
		// keyboard & mouse controls
		ig.input.bind( ig.KEY.UP_ARROW, 'forward' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'back' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		
		ig.input.bind( ig.KEY.ESC, 'pause' );
		
		ig.input.bind( ig.KEY.W, 'forward' );
		ig.input.bind( ig.KEY.A, 'stepleft' );
		ig.input.bind( ig.KEY.S, 'back' );
		ig.input.bind( ig.KEY.D, 'stepright' );
	},

	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	},
});


var width = 640;
var height = 480;

if( ig.System.hasWebGL() ) {
	ig.main( '#canvas', MyGame, 60, width, height, 1, tpf.Loader );
}
else {
	ig.$('#game').style.display = 'none';
	ig.$('#no-webgl').style.display = 'block';
}
});
