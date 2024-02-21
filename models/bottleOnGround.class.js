/**
 * Represents a bottle object in the game.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Bottle extends MovableObject {
  height = 65;
  width = 55;
  x = 320;
  y = 360;

  IMAGES_BOTTLE_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE_ON_GROUND);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_ON_GROUND);
    }, 200);
  }
}
