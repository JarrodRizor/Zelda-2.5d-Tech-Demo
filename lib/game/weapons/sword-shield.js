ig.module(
	'game.weapons.sword-shield'
)
.requires(
	'game.weapons.base',
	'plugins.twopointfive.entity',
	'impact.entity-pool'
)
.defines(function(){

SwordShield = Weapon.extend({
	offset: {x: 0, y: 235},
	// projectileOffset: -8,

	maxAmmo: 80,
	cooldown: 1,

    animSheet: new ig.AnimationSheet( 'media/sword_shield.png', 360, 240),
    shootSound: new ig.Sound( 'media/sounds/LOZ_Sword_Shoot.*' ),
    emptySound: new ig.Sound( 'media/sounds/LOZ_Sword_Slash.*' ),


	init: function( ammo ) {
		this.parent( ammo );
		this.addAnim( 'idle', 100, [0] );
		this.addAnim( 'shoot', 0.4, [1,0], true );
		this.shootSound.volume = 0.8;
	},

	depleted: function() {
		if( this.shootTimer.delta() > 0 && this.ammo <= 0 ) {
			this.shootTimer.set( this.cooldown );
			this.emptySound.play();
			return true;
		}
		else {
			return false
		}
	},

	shoot: function( x, y, angle ) {
		ig.game.spawnEntity(EntityBeam, x, y, {angle: angle} );
		this.currentAnim = this.anims.shoot.rewind();
		this.shootSound.play();

		this.flash(0.2);
	}
});


EntityBeam = tpf.Entity.extend({
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER,
	size: {x: 8, y: 8},
	speed: 450,
	scale: 0.25,

	animSheet: new ig.AnimationSheet( 'media/beam.png', 24, 24 ),
	//explodeSound: new ig.Sound( 'media/sounds/explosion.*' ),
	//bounceSound: new ig.Sound( 'media/sounds/grenade-bounce.*' ),

	init: function( x, y, settings ) {
		this.parent( x-this.size.x/2, y-this.size.y/2, settings );
		this.addAnim( 'idle', .2, [0,1] );
		//this.bounceSound.volume = 0.6;
		//this.explodeSound.volume = 0.9;
		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		console.log(this.vel.y);

		this.vel.z = 1;
		this.pos.z = 0;
	},
	
	reset: function( x, y, settings ) {
		this.parent( x-this.size.x/2, y-this.size.y/2, settings );
		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		this.vel.z = 1;
		this.pos.z = 0;
		this.currentAnim = this.anims.idle.rewind();
	},

	update: function() {
		if( this.currentAnim.loopCount > 0 ) {
			this.kill();
			return;
		}

		this.parent();
	},

	check: function( other ) {
		other.kill(); // temp solution
		this.kill();
	},

	handleMovementTrace: function( res ) {
		if( res.collision.x || res.collision.y ) {
			this.kill();
		}
		this.parent(res);
	}
});

});