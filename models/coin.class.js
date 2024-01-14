class Coin extends MovableObject {
  height = 100;
  width = 100;
  x = 200;
  y = 300;

  originalWidth = 100; // Ursprüngliche Breite speichern
  scale = 1; // Skalierungsfaktor

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);

    this.animate();
  }

  //   animate() {
  //     setInterval(() => {
  //       this.playAnimation(this.IMAGES_COIN);
  //     }, 200);
  //   }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);

      // Skalierungsfaktor ändern, um 3D-Rotation zu simulieren
      this.scale = 0.5 + Math.abs(Math.cos(Date.now() / 500)) * 0.5;
      this.width = this.originalWidth * this.scale; // Breite basierend auf dem Skalierungsfaktor anpassen
    }, 200);
  }
}
