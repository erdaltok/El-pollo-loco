/**
 * Represents the status bar for displaying the number of coins collected by the character.
 */
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

  /**
   * Initializes the status bar with default settings.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 5;
    this.y = 45;
    this.height = 45;
    this.width = 200;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage of coins collected and updates the status bar image accordingly.
   * @param {number} percentage - The new percentage of coins collected.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the index of the image to display based on the current percentage.
   * @returns {number} The index of the image in the IMAGES_COINS array.
   */

  resolveImageIndex() {
    return Math.min(Math.floor(this.percentage / 20), 5);
  }
}
