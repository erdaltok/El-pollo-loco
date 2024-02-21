/**
 * Represents the status bar for displaying the number of bottles the character has.
 */
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

  /**
   * Initializes the status bar with default settings.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES);
    this.x = 5;
    this.y = 90;
    this.height = 45;
    this.width = 200;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage of bottles collected and updates the status bar image accordingly.
   * @param {number} percentage - The new percentage of bottles collected.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the index of the image to display based on the current percentage.
   * @returns {number} The index of the image in the IMAGES_BOTTLES array.
   */
  resolveImageIndex() {
    return Math.min(Math.floor(this.percentage / 20), 5);
  }
}
