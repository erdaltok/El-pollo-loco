class Chicks extends MovableObject {
  height = 40;
  width = 40;
  y = 381;
  x = 780;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  // constructor() {
  //   super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
  //   this.loadImages(this.IMAGES_WALKING);
  //   this.x = 200 + Math.random() * 500;
  //   this.speed = 0.15 + Math.random() * 0.28;
  //   this.animate();
  // }

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    // Der x-Wert wird in der World-Klasse gesetzt
    this.speed = 0.15 + Math.random() * 0.28;
    this.animate();
  }

  animate() {
    this.moveLeft();

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 4.5);
  }
}