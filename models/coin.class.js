class Coin extends MovableObject {
  height = 100;
  width = 100;
  x = 200;
  y = 300;

  offset = {
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
  };

  originalWidth = 100; 

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 200);
  }
}
