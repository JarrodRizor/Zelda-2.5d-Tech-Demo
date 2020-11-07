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
        scale: .5,
        speed: 64,
        damage: 1,
        maxHeight:null,
        minHeight:null,
        gravityFactor: 0,
        didHurtPlayer: false,
        seenPlayer: false,
        directions: [32],
        timer: new ig.Timer(),
        starting_point: null,
    
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
            var direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            if(this.timer.delta() > 4){
                //this.vel.x = Math.sin(direction) * this.speed;
                this.pos.x = this.pos.x + direction;
                this.vel.x += Math.cos(this.pos.x + direction);
                this.timer.reset();
                //console.log(this.vel.x);
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