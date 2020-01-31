ig.module(
    'game.entities.player'
).requires(
    'plugins.twopointfive.entity',
).defines(function(){

    EntityPlayer = tpf.Entity.extend({

        type: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

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