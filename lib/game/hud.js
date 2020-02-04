ig.module(
	'game.hud'
)
.requires(
	'plugins.twopointfive.hud'
)
.defines(function(){

MyHud = tpf.Hud.extend({

	font: new tpf.Font( 'media/fredoka-one.font.png' ),

	keys: [],

	showControlsTimer: null,

	init: function( width, height, showControls ) {
		this.parent(width, height);
	},

	draw: function( player, weapon ) {
		this.prepare();

		// Draw the current message (showMessage(text)) and the damage indicator
		this.drawDefault();
	}
});


});