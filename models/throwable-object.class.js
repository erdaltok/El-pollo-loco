/**
 * Represents a throwable object, such as a bottle, in the game.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  height = 65;
  width = 55;
  bottleOnGround = false;
  world;
  animationInterval = null;

  offset = { top: 4, left: 2, right: 2, bottom: 4 };

  IMAGES_THROWABLEOBJECT_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Initializes a new throwable object with its position and images.
   * @param {number} x - The starting x-coordinate of the object.
   * @param {number} y - The starting y-coordinate of the object.
   */
  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_THROWABLEOBJECT_BOTTLE);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.world = world;
  }

  /**
   * Throws the bottle, applying gravity and moving it forward until it lands.
   * Decreases the available bottles and updates the status bar accordingly.
   * @param {World} world - The game world instance to interact with.
   */
  throw(world) {
    if (world.availableBottles <= 0) {
      return;
    }
    this.bottleOnGround = false;
    this.isAboveGround();
    this.applyGravity();
    this.speedY = 25;
    world.availableBottles--;
    world.statusBarBottles.setPercentage(world.availableBottles * 20);
    this.animationInterval = setInterval(() => {
      this.x += 14;
      this.playAnimation(this.IMAGES_THROWABLEOBJECT_BOTTLE);
      if (this.y >= 380) {
        this.handleBottleLanding();
      }
      if (this.isColliding(world.endboss)) {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    }, 1000 / 25);
  }

  /**
   * Applies gravity to the object, making it fall or jump.
   */
  applyGravityThrowAbleObject() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Handles the landing of the bottle, stopping its movement and playing the splash animation.
   * @param {number} animationInterval - The interval ID to clear when the bottle lands.
   */
  handleBottleLanding() {
    if (!this.bottleOnGround) {
      this.y = 380;
      this.speedY = 0;
      this.bottleOnGround = true;
      clearInterval(this.animationInterval);
      this.animationInterval = null;
      this.playSplashAnimation();
      if (this.world) {
        this.world.bottle_smash_sound.play();
      }
    }
  }

  /**
   * Stops the current animation of the object, if any, by clearing the interval.
   * Resets the animation interval identifier to null, indicating no ongoing animation.
   */
  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Plays the splash animation of the bottle and executes a callback function if provided.
   * @param {Function} [callback] - An optional callback function to execute after the animation.
   */
  playSplashAnimation(callback) {
    this.speedY = 0;
    this.speed = 0;
    let animationIndex = 0;
    const animation = () => {
      if (animationIndex < this.IMAGES_BOTTLE_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_BOTTLE_SPLASH[animationIndex++]];
        setTimeout(animation, 1000 / 60);
      } else if (callback) {
        callback();
      }
    };
    animation();
  }
}
