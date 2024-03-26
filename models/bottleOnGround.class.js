/**
 * Represents a bottle object in the game.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Bottle extends MovableObject {
  height = 65;
  width = 55;
  x = 320;
  y = 360;

  offset = {
    top: 0,
    bottom: 0,
    left: 8,
    right: 8,
  };

  IMAGES_BOTTLE_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new Bottle object with specified dimensions and position.
   * It also initializes the bottle's images for when it's on the ground and starts its animation.
   */
  constructor() {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE_ON_GROUND);
    this.animate();
  }

  /**
   * The animate method sets up a repeating action that changes the bottle's image at a set interval.
   * This creates the appearance of animation.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_ON_GROUND);
    }, 200);
  }
}
