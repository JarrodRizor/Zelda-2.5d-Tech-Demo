ig.module(
	'game.entities.keese'
)
.requires(
	'plugins.twopointfive.entity',
	'game.entities.particle'
)
.defines(function(){

    EntityKeese= tpf.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,

        size: {x: 16, y: 16},
        scale: .6,
        speed: 40,

        damage: 1,

        didHurtPlayer: false,
        seenPlayer: false,
    
        animSheet: new ig.AnimationSheet( 'media/characters/keese.png', 48, 24 ),
        deathSound: new ig.Sound( 'media/sounds/enemy_defeated.*' ),

        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 0.1, [0,1] );
        },

        update: function(){
            // this.angle = this.angleTo( ig.game.player );

            // this.vel.x = Math.cos(this.angle) * this.speed;
            // this.vel.y = Math.sin(this.angle) * this.speed;
            
            // if( ig.game.dead ) {
            //     // Move away from the player if he's dead
            //     this.vel.x *= -1;
            //     this.vel.y *= -1;
            // }

            this.parent();
        },

        kill: function() {
            var cx = this.pos.x + this.size.x/2;
            var cy = this.pos.y + this.size.y/2;
            for( var i = 0; i < 20; i++ ) {
                ig.game.spawnEntity( EntityKeeseGib, cx, cy );
            }
            this.deathSound.play();
            this.parent();
        },
    
        check: function( other ) {
            other.receiveDamage( this.damage, this );
        }
    });

    EntityKeeseGib = EntityParticle.extend({
        vpos: 0,
        scale: 0.5,
        initialVel: {x:120, y: 120, z: 2.5},
        friction: {x: 10, y: 10},
        
        lifetime: 2,
       
        animSheet: new ig.AnimationSheet( 'media/blob-gib.png', 16, 16 ),
        
        init: function( x, y, settings ) {
            this.addAnim( 'idle', 5, [0,1,2,3,4,5,6,7,8,9,10,11] );
            this.parent( x, y, settings );
        }
    });
    
});