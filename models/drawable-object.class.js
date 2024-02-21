class DrawableObject {
  x = 50;
  y = 270;
  height = 150;
  width = 100;

  img;
  imageCache = {};
  currentImage = 0;

  
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // drawFrame only character and chicken
  drawFrame(ctx) {
    // if (
    //   this instanceof Character ||
    //   this instanceof Coin ||
    //   this instanceof Chicken ||
    //   this instanceof Bottle ||
    //   this instanceof Endboss ||
    //   this instanceof Chicks ||
    //   this instanceof ThrowableObject
    // ) {
    //   ctx.beginPath();
    //   ctx.lineWidth = "2";
    //   ctx.strokeStyle = "red";
    //   ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right - this.offset.left, this.height - this.offset.bottom - this.offset.top);
    //   ctx.stroke();
    // }
  }

  // // drawFrame all objects
  // drawFrame(ctx) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  // }

  /**
   *
   * @param {Array*} arr - ['img/image1.png', 'img/image2.png', ...]
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
