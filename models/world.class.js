class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas; // mit this.canvas wird auf die canvas Variable oben in der Class zugegriffen. Und wird an canvas im constructror übergeben.
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.createChickens();
    this.createChicks();
    this.addBottlesOnGround();
    this.addCoins();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
   setInterval(() => {
     this.level.enemies.forEach((enemy) => {
       if (this.character.isColliding(enemy)) {
         console.log('Collision with Character', enemy)
       }
      });
   }, 200); 
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectibles);

    this.ctx.translate(-this.camera_x, 0);

    // draw wird immer wieder mit dieser Funktion ausgeführt. also async. Erst wenn alles oben drüber gezeichnet worden ist.
    let self = this; // Achtung: speziell in dieser Funktion wird "this" nicht erkannt. Daher muss man this an eine Variable übergeben. In diesem Fall "let self". Dieser wird dann statt "this." verwendet.
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  createChickens() {
    let startPosition = 720;
    let endPosition = 3050;
    let spacing = 250;

    for (let x = startPosition; x <= endPosition; x += spacing) {
      let chicken = new Chicken();
      chicken.x = x;
      this.level.enemies.push(chicken);
    }
  }

  createChicks() {
    let startPosition = 780;
    let endPosition = 3050;
    let spacing = 450;

    for (let x = startPosition; x <= endPosition; x += spacing) {
      let chicks = new Chicks();
      chicks.x = x;
      this.level.enemies.push(chicks);
    }
  }

  addBottlesOnGround() {
    let startPosition = 500;
    let endPosition = 3000;
    let spacing = 300;

    for (let x = startPosition; x <= endPosition; x += spacing) {
      const bottle = new Bottle();
      bottle.x = x;
      this.level.collectibles.push(bottle);
    }
  }

  addCoins() {
    let startPosition = 700;
    let endPosition = 2800;
    let spacing = 300;

    for (let x = startPosition; x <= endPosition; x += spacing) {
      const coin = new Coin();
      coin.x = x;
      this.level.collectibles.push(coin);
    }
  }
}
