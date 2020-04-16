ig.module(
	'game.hud'
)
.requires(
	'plugins.twopointfive.hud'
)
.defines(function(){

MyHud = tpf.Hud.extend({

	font: new tpf.Font( 'media/fredoka-one.font.png' ),

	init: function( width, height, showControls ) {
		this.parent(width, height);

	},

	draw: function( player, weapon ) {
		this.prepare();

		if( weapon ) {
			weapon.draw();
		}

		// Draw the current message (showMessage(text)) and the damage indicator
		this.drawDefault();
	}
});


});