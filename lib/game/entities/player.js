Image.module(
    'game.entities.player'
).requires(
    'plugin.twpointfive.entity',
).define(function(){

    EntityPlayer = tpf.Entity.extend({

        type: Image.Entity.TYPE.A,
        collides: Image.Entity.COLLIDES.PASSIVE,

        size: {x: 16, y: 16},
        speed: 50,
        heath: 100,
        dead: false,

        init: function(x, y, settings) {

        },

        update: function(){
            
        }

    });

});