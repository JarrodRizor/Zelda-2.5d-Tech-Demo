ig.module(
	'game.entities.player'
)
.requires(
	'plugins.twopointfive.entity',
	'plugins.mouse-delta',
	'game.weapons.sword-shield'
)
.defines(function(){

EntityPlayer = tpf.Entity.extend({
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	size: {x: 16, y: 24},
	
	angle: 0,
	internalAngle: 0,
	turnSpeed: (90).toRad(),
	moveSpeed: 100,
	bob: 0,
	bobSpeed: 0.1,
	bobHeight: 0.8,
	
	health: 3,
	maxHealth: 3,
	
	weapons: [],

	currentWeapon: null,
	currentWeaponIndex: -1,
	delayedWeaponSwitchIndex: -1,

	currentLightColor: {r:1, g:1, b:1, a:1},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.internalAngle = this.angle;
		ig.game.player = this;
	},
	
	ready: function() {
		var cx = this.pos.x + this.size.x/2,
			cy = this.pos.y + this.size.y/2;
		ig.system.camera.position[0] = cx;
		ig.system.camera.position[2] = cy;

		this.giveWeapon( SwordShield, 16 );
	},
	
	update: function() {
		
		// Move
		var dx = 0, 
			dy = 0;
		
		if( ig.input.state('forward') ) {
			dy = 1;
		}
		else if( ig.input.state('back') ) {
			dy = -1;
		}
		
		// Turn viewpoint with mouse?
		if( ig.system.isFullscreen || ig.system.hasMouseLock ) {
			this.internalAngle -= ig.input.mouseDelta.x / 400;
		}

		// Turn with keys
		if( ig.input.state('left') ) {
			this.internalAngle += this.turnSpeed * ig.system.tick;
		}
		else if( ig.input.state('right') ) {
			this.internalAngle -= this.turnSpeed * ig.system.tick;	
		}

		// Sidestep
		if( ig.input.state('stepleft') ) {
			dx = 1;
		}
		else if( ig.input.state('stepright') ) {
			dx = -1;
		}
		
		// If we have a head tracker connected, add its rotation to our own;
		// It's a bit of a hack to have this here, but we want to change the
		// aim direction of the player with the head movement as well.
		var trackerRotation = [0,0,0];
		var trackerPosition = [0,0,0];
		if( ig.system.renderer instanceof tpf.StereoRenderer ) {
			var state = ig.system.renderer.getHMDState();
			trackerRotation = state.rotation;
			trackerPosition = state.position;
		}

		this.angle = this.internalAngle + trackerRotation[0];

		// Normalize movement vector
		if( Math.abs(dx) + Math.abs(dy) > 1 ) {
			dx *= Math.SQRT1_2;
			dy *= Math.SQRT1_2;
		}

		// Set the desired velocity based on our angle and which keys are
		// pressed
		this.vel.x = -Math.sin(this.angle) * dy * this.moveSpeed 
			-Math.sin(this.angle+Math.PI/2) * dx * this.moveSpeed;

		this.vel.y = -Math.cos(this.angle) * dy * this.moveSpeed 
			-Math.cos(this.angle+Math.PI/2) * dx * this.moveSpeed;
		
		
		// Change Weapon; be careful to only switch after the shoot button was released
		if( this.delayedWeaponSwitchIndex >= 0 ) {
			this.switchWeapon( this.delayedWeaponSwitchIndex );
		}
		
		if( ig.input.pressed('weaponNext') && this.weapons.length > 1 ) {
			this.switchWeapon( (this.currentWeaponIndex + 1) % this.weapons.length );
		}
		else if( ig.input.pressed('weaponPrev') && this.weapons.length > 1 ) {
			var index = (this.currentWeaponIndex == 0) 
				? this.weapons.length - 1 
				: this.currentWeaponIndex - 1;
			this.switchWeapon( index );
		}
		
		// Calculate new position based on velocity; update sector and light etc...
		this.parent();

		// Calculate bobbing
		this.bob += ig.system.tick * this.bobSpeed * Math.min(Math.abs(dx) + Math.abs(dy),1) * this.moveSpeed;
		var bobOffset = Math.sin(this.bob) * this.bobHeight;
		
		if( this.currentWeapon ) {
			this.currentWeapon.bobOffset = Math.sin(this.bob+Math.PI/2) * this.bobHeight * 4;
			this.currentWeapon.update();
		}
		
		// Update camera position and view angle
		var cx = this.pos.x + this.size.x/2,
			cy = this.pos.y + this.size.y/2;

		ig.system.camera.setRotation( trackerRotation[2], trackerRotation[1], this.angle );

		// If we have a head tracker connected, we may to adjust the position a bit
		if( ig.system.renderer instanceof tpf.StereoRenderer ) {
			var tt = trackerPosition;
			var a = this.internalAngle;
			var ttx = tt[0] * Math.cos(-a) - tt[2] * Math.sin(-a);
			var tty = tt[0] * Math.sin(-a) + tt[2] * Math.cos(-a);
			ig.system.camera.setPosition( cx + ttx, cy + tty, tt[1] );
		}
		else {
			ig.system.camera.setPosition( cx, cy, bobOffset );
		}
	},
	
	
	giveWeapon: function( weaponClass, ammo ) {
		// Do we have this weapon already? Add ammo!
		var index = -1;
		for( var i = 0; i < this.weapons.length; i++ ) {
			var w = this.weapons[i];
			if( w instanceof weaponClass ) {
				index = i;
				w.giveAmmo( ammo );
			}
		}
		
		// New weapon?
		if( index === -1 ) {
			this.weapons.push( new weaponClass(ammo) );
			index = this.weapons.length - 1;
		}
		
		this.SwordShield( index );
	},
	
	SwordShield: function( index ) {
		if( this.currentWeapon ) {
			if( this.currentWeapon.shootTimer.delta() < 0 ) {
				this.delayedWeaponSwitchIndex = index;
				return;
			}
		}
		
		this.delayedWeaponSwitchIndex = -1;
		this.currentWeaponIndex = index;
		this.currentWeapon = this.weapons[index];
		
		if( this.currentWeapon.ammoIcon ) {
			this.currentWeapon.ammoIcon.setPosition( 
				215, 
				ig.game.hud.height-this.currentWeapon.ammoIcon.tileHeight-6 
			);
		}
		
		this.currentWeapon.setLight( this.currentLightColor );
	},

	setLight: function( color ) {
		this.currentLightColor = color;
		if( this.currentWeapon ) {
			this.currentWeapon.setLight( color );
		}
	}
});

});