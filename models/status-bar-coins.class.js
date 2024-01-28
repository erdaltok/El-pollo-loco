class StatusBarCoins extends DrawableObject {
  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 5;
    this.y = 45;
    this.height = 45;
    this.width = 200;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    return Math.min(Math.floor(this.percentage / 20), 5);
  }
}
