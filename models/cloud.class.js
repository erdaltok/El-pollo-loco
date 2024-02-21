class Cloud extends MovableObject {
  y = 20;
  width = 720;
  height = 250;
  speed = 0.2;

  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.x < -this.width) {
      this.x = this.width * 2 - Math.random() * 500;
    }
  }
}

