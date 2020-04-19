ig.module(
	'game.entities.stalfos'
)
.requires(
	'plugins.twopointfive.entity',
	'game.entities.particle'
)
.defines(function(){

    EntityStalfos = tpf.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        size: {x: 16, y: 16},
        scale: .5,
        speed: 40,
        damage: 1,
        maxHeight:null,
        minHeight:null,
        gravityFactor: 0,
        didHurtPlayer: false,
        seenPlayer: false,
    
        animSheet: new ig.AnimationSheet( 'media/characters/stalfos.png', 64, 64 ),
        deathSound: new ig.Sound( 'media/sounds/enemy_defeated.*' ),

        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 0.3, [0,1] );
            this.maxHeight = this.pos.y-20;
            this.minHeight = this.pos.y +5;
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
                ig.game.spawnEntity( EntityStalfosGib, cx, cy );
            }
            this.deathSound.play();
            this.parent();
        },
    
        check: function( other ) {
            other.receiveDamage( this.damage, this );
        }
    });

    EntityStalfosGib = EntityParticle.extend({
        vpos: 0,
        scale: 0.2,
        initialVel: {x:60, y: 40, z: 2.5},
        friction: {x: 10, y: 10},
        
        lifetime: 2,
       
        animSheet: new ig.AnimationSheet( 'media/goriyagibs.png', 16, 16 ),
        
        init: function( x, y, settings ) {
            this.addAnim( 'idle', 5, [0,0,1,1,2,2] );
            this.parent( x, y, settings );
        }
    });
    
});