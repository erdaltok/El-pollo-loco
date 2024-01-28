class StatusBarBottles extends DrawableObject {
  IMAGES_BOTTLES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES);
    this.x = 5;
    this.y = 90; // 20px unter der StatusBarCoins
    this.height = 45;
    this.width = 200;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    return Math.min(Math.floor(this.percentage / 20), 5);
  }
}
