/**
 * Represents a drawable object in the game, providing basic functionality for loading and drawing images.
 */
class DrawableObject {
  x = 50;
  y = 270;
  height = 150;
  width = 100;

  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads an image from a given path and sets it as the current image for the object.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object's current image onto the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Optionally draws a frame around the object. This method is intended for debugging purposes to visualize the object's bounding box.
   * Currently, it's commented out but can be customized and enabled as needed.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  drawFrame(ctx) {
    
  }

  /**
   * Loads multiple images from an array of paths and caches them for later use.
   * This method is useful for preloading all frames of an animation.
   * @param {Array<string>} arr - An array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
