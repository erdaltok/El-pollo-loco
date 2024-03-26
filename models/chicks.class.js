/**
 * Represents a smaller chicken enemy, referred to as "Chicks", in the game.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Chicks extends MovableObject {
  height = 40;
  width = 40;
  y = 381;
  x = 780;

  offset = {
    top: 6,
    left: 10,
    right: 10,
    bottom: 3,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  dead = false;
  isCollidable = true;
  moveInterval = null;
  animationInterval = null;

  /**
   * Constructor for the Chicks class.
   * Initializes the chicks with an image and sets up its walking animation and movement.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.75 + Math.random() * 0.28;
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
   * Marks the chicken or chick character as dead, makes it non-collidable, and updates its image to show its dead state.
   * Stops any ongoing movement and animation intervals for the character, ensuring it no longer interacts with the game world.
   * After a brief delay, the character is removed from the array of enemies in the game world, effectively removing it from the game.
   */
  die() {
    this.dead = true; 
    this.isCollidable = false;
    this.loadImage("img/3_enemies_chicken/chicken_small/2_dead/dead.png");
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
   * Stops both actions if the chicks is dead.
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
    }, 1000 / 4.5);
  }
}
