class StatusBarEndboss extends DrawableObject {
  percentage = 100;

  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 40;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }


  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    this.img = this.imageCache[this.IMAGES[index]];
  }

  resolveImageIndex() {
    if (this.percentage > 75) {
      return 0; // 100%
    } else if (this.percentage > 50) {
      return 1; // 80%
    } else if (this.percentage > 25) {
      return 2; // 60%
    } else if (this.percentage > 0) {
      return 3; // 40%
    } else {
      return 4; // 0%
    }
  }
}
