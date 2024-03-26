/**
 * Represents a coin in the game that the character can collect.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Coin extends MovableObject {
  height = 100;
  width = 100;
  x = 200;
  y = 300;

  offset = {
    top: 25,
    left: 25,
    right: 25,
    bottom: 25,
  };

  originalWidth = 100;

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Constructor for the Coin class.
   * Initializes the coin with its first image and sets up its animation.
   */
  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.animate();
  }

  /**
   * Animates the coin by cycling through its images.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 200);
  }
}
