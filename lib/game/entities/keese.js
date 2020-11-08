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
        bounciness: 1,
        size: {x: 16, y: 16},
        scale: .5,
        speed: 55,
        damage: 1,
        maxHeight:null,
        minHeight:null,
        gravityFactor: 0,
        didHurtPlayer: false,
        seenPlayer: false,
        directions: [0,16,-16,32,-32,48,-48,64,-64],
        timer: new ig.Timer(),
        direction: null,
        count: 0,

        starting_point: null,
        starting_direction: 32,
        stop: true,
    
        animSheet: new ig.AnimationSheet( 'media/characters/keese.png', 48, 24 ),
        deathSound: new ig.Sound( 'media/sounds/enemy_defeated.*' ),

        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 0.1, [0,1] );
            this.maxHeight = this.pos.y-20;
            this.minHeight = this.pos.y +5;
            this.starting_point = this.pos.x;
        },

        update: function(){

            this.direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            this.count++;

            if(this.count >= 25 && this.stop == true){
            
                this.vel.x = Math.cos(this.direction) * (Math.random() * (64 - 1) + this.speed);
                this.vel.y = Math.sin(this.direction) * (Math.random() * (64 - 1) + this.speed);
                this.stop = false;
            }
            if(this.count >= 125 && this.stop == false){
                this.vel.y = 0;
                this.vel.x = 0;
                this.count = 0;
                this.stop = true;
            }
            this.pos.z = 15;
                
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
        },

        handleMovementTrace: function( res ) {
            if( res.collision.x && this.vel.y > 16 ) {
               // move away from wall

            }
            // Continue resolving the collision as normal
            this.parent(res); 
        }
    });

    EntityKeeseGib = EntityParticle.extend({
        vpos: 0,
        scale: 0.2,
        initialVel: {x:60, y: 40, z: 2.5},
        friction: {x: 10, y: 10},
        
        lifetime: 2,
       
        animSheet: new ig.AnimationSheet( 'media/keesegibs.png', 16, 16 ),
        
        init: function( x, y, settings ) {
            this.addAnim( 'idle', 5, [0,0,1,1,2,2] );
            this.parent( x, y, settings );
        }
    });
    
});