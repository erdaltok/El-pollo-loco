/**
 * Represents a chicken enemy in the game.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Chicken extends MovableObject {
  height = 60;
  width = 60;
  y = 361;
  x = 720;

  offset = {
    top: 3, 
    left: 4,
    right: 4,
    bottom: 5,
  };
  
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  dead = false;
  isCollidable = true;
  moveInterval = null;
  animationInterval = null;

  /**
   * Constructor for the Chicken class.
   * Initializes the chicken with an image and sets up its walking animation and movement.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.7 + Math.random() * 0.28;
    this.animate();
  }

  /**
   * Sets the world context for the chicken, allowing interaction with the game world.
   * @param {World} world - The game world instance.
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Handles the chicken's death by changing its image, stopping its movement and animation,
   * and removing it from the game world after a delay.
   */
  die() {    
    this.dead = true;
    this.isCollidable = false;
    this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");

    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 1000);
  }

  /**
   * Animates the chicken by moving it left and cycling through walking images.
   * Stops both actions if the chicken is dead.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 9);
  }
}
