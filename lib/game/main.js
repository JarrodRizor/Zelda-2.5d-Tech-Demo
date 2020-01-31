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
		// Initialize your game here; bind keys etc.
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
