ig.module(
	'game.entities.goriya'
)
.requires(
	'plugins.twopointfive.entity'
)
.defines(function(){

    EntityGoriya = tpf.Entity.extend({
        size: {x: 16, y: 16},
        scale: 0.5,

        dynamicLight: true,
        _wmBoxColor: '#ff0000',

        angle: 0,

        animSheet: new ig.AnimationSheet( 'media/characters/goriya.png', 64, 64 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', .2, [0,1] );
        },
    });
}); 