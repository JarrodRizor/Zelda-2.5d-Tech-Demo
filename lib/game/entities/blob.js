ig.module(
	'game.entities.blob'
)
.requires(
	'plugins.twopointfive.entity',
	'game.entities.particle'
)
.defines(function(){

    EntityBlob = tpf.Entity.extend({
        size: {x: 16, y: 16},
        scale: 0.5,

        dynamicLight: true,
        _wmBoxColor: '#ff0000',

        angle: 0,

        animSheet: new ig.AnimationSheet( 'media/characters/blob.png', 32, 32 ),
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 1, [0,1] );
        },
    });
});