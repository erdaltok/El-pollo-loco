/**
 * Represents a base class for all movable objects in the game, providing common properties and methods for movement, collision, and animation.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  isCollidable = true;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity to the object, making it fall or jump.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 177;
    }
  }

  /**
   * Determines if the object is colliding with another movable object.
   * @param {MovableObject} mo - The other movable object to check collision with.
   * @returns {boolean} True if colliding, false otherwise.
   */
  isColliding(mo) {
    return (
      this.x + (this.width - this.offset.right) > mo.x + mo.offset.left &&
      this.y + (this.height - this.offset.bottom) > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + (mo.width - mo.offset.right) &&
      this.y + this.offset.top < mo.y + (mo.height - mo.offset.bottom)
    );
  }

  /**
   * Reduces the energy of the object when hit and updates the last hit time.
   */
  hit() {
    this.energy -= 5;
    if (this.energy <= 20) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is currently hurt.
   * @returns {boolean} True if the object was hit recently, false otherwise.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean} True if the object's energy is 0, false otherwise.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation sequence for the object.
   * @param {Array} images - An array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right by increasing its x-coordinate.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left by decreasing its x-coordinate.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump by setting the vertical speed if the object is on the ground.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 29;
    }
  }

  /**
   * Corrects the object's position to ensure it lands on the ground.
   */
  correctLanding() {
    if (this.y > 177) {
      this.y = 177;
      this.speedY = 0;
    }
  }
}
