ig.module(
	'game.hud'
)
.requires(
	'plugins.twopointfive.hud'
)
.defines(function(){

MyHud = tpf.Hud.extend({

	font: new tpf.Font( 'media/fredoka-one.font.png' ),

	healthIconImage: new ig.Image( 'media/health-icon.png' ),
	healthIcon: null,

	keys: [],

	showControlsTimer: null,

	init: function( width, height, showControls ) {
		this.parent(width, height);

		this.healthIcon = new tpf.HudTile( this.healthIconImage, 0, 32, 32 );
		this.healthIcon.setPosition( 96, this.height-this.healthIcon.tileHeight-4 );
	},

	draw: function( player, weapon ) {
		this.prepare();

		if( weapon ) {
			weapon.draw();
		}

		this.healthIcon.draw();
		this.font.draw( player.health, 90, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT );

		this.drawDefault();
	}
});


});