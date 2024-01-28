class Chicken extends MovableObject {
  height = 60;
  width = 60;
  y = 361;
  x = 720;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  dead = false;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.15 + Math.random() * 0.28;
    this.animate();
  }

  // hitFromAbove() {
  //   this.speed = 0; // Chicken stoppt
  //   this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
  // }

 

  animate() {
    setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 4.5);
  }
}
