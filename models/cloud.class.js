/**
 * Represents a cloud in the game's background.
 * This class extends MovableObject to inherit properties and methods for movement.
 */
class Cloud extends MovableObject {
  y = 20;
  width = 720;
  height = 250;
  speed = 0.2;

  /**
   * Constructor for the Cloud class.
   * Initializes the cloud with an image and sets its horizontal position.
   * @param {string} imagePath - The path to the cloud's image file.
   * @param {number} x - The initial horizontal position of the cloud.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  /**
   * Animates the cloud by moving it left continuously.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Moves the cloud left across the screen.
   * If the cloud moves off-screen to the left, it repositions to the right for a continuous loop.
   */
  moveLeft() {
    this.x -= this.speed;
    if (this.x < -this.width) {
      this.x = this.width * 2 - Math.random() * 500;
    }
  }
}
