ig.module(
	'game.entities.stalfos'
)
.requires(
	'plugins.twopointfive.entity'
)
.defines(function(){

    EntityStalfos = tpf.Entity.extend({
        size: {x: 16, y: 16},
        scale: 0.5,

        dynamicLight: true,
        _wmBoxColor: '#ff0000',

        angle: 0,

        animSheet: new ig.AnimationSheet( 'media/characters/stalfos.png', 64, 64 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', .3, [0,1] );
        },
    });
}); 