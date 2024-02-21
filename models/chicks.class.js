/**
 * Represents a smaller chicken enemy, referred to as "Chicks", in the game.
 * This class extends MovableObject to inherit properties and methods for movement and animation.
 */
class Chicks extends MovableObject {
  height = 40;
  width = 40;
  y = 381;
  x = 780;

  offset = { top: 10, left: +5, right: +15, bottom: 0 };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Constructor for the Chicks class.
   * Initializes the chicks with an image and sets up its walking animation and movement.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    // Der x-Wert wird in der World-Klasse gesetzt
    this.speed = 0.15 + Math.random() * 0.28;
    this.animate();
  }

  /**
   * Animates the chicks by moving them left and cycling through walking images.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 4.5);
  }
}
