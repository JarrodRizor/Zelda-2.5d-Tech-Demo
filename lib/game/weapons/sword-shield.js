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
		offset: {x: 0, y: 170},
		animSheet: new ig.AnimationSheet( 'media/misc/sword_shield.png', 360, 180),

		init: function( ammo ) {
			this.parent( ammo );
			this.addAnim( 'idle', 100, [0] );
		}
	});
}); 