/**
 * Represents a background object in the game, such as clouds or scenery layers.
 * Inherits from MovableObject to utilize common functionality.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Constructs an object with a specified image and position.
   * This constructor is part of a class that likely extends MovableObject or a similar parent class,
   * allowing it to use methods like loadImage() for setting its visual representation.
   * @param {string} imagePath - The path to the image file used as the object's visual representation.
   * @param {number} x - The initial x-coordinate of the object on the canvas.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
