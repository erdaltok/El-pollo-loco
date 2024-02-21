/**
 * Represents a background object in the game, such as clouds or scenery layers.
 * Inherits from MovableObject to utilize common functionality.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
