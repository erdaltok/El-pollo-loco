class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  statusBarCoins = new StatusBarCoins();
  statusBarBottles = new StatusBarBottles();
  availableBottles = 0;

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
    this.run();
    this.checkCollisionsWithCoins();
    this.checkCollisionWithBottles();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsWithCoins();
      this.checkCollisionWithBottles();
      this.checkThrowObjects();
      this.checkJumpOnChicken(); // Hinzufügen des Aufrufs
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.availableBottles > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      bottle.throw(this); // World-Objekt übergeben
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        if (enemy instanceof Chicken && this.jumpOnChicken(enemy)) {
          // Charakter trifft Chicken von oben
          this.removeEnemy(enemy, index);
        } else if (enemy instanceof Chicks || !this.jumpOnChicken(enemy)) {
          // Kollision mit Chicks oder seitliche Kollision mit Chicken
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

   checkJumpOnChicken() {
      this.level.enemies.forEach((enemy) => {
        if (this.jumpOnChicken(enemy)) {
          this.removeEnemy(enemy);
        }
      });
    }



  jumpOnChicken(enemy) {
    return (
      enemy.constructor === Chicken &&
      this.character.isColliding(enemy) &&
      this.character.y < enemy.y &&
      this.character.speedY < 0
    );
  }

  removeEnemy(enemy) {
    if (enemy.constructor === Chicken) {
      enemy.dead = true;
      enemy.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
      enemy.toBeRemoved = true; // Markieren des Chickens zur Entfernung

      setTimeout(() => {
        this.level.enemies = this.level.enemies.filter((e) => !e.toBeRemoved);
      }, 2000);
    }
  }

  checkCollisionsWithCoins() {
    this.level.collectibles.forEach((collectible, index) => {
      if (
        collectible instanceof Coin &&
        this.character.isColliding(collectible)
      ) {
        this.level.collectibles.splice(index, 1); // Coin entfernen
        this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
        if (this.statusBarCoins.percentage >= 100) {
          this.statusBar.setPercentage(100); // Charakter-Statusleiste auf 100% setzen
          this.statusBarCoins.setPercentage(0); // StatusBarCoins zurücksetzen
        }
      }
    });
  }

  checkCollisionWithBottles() {
    this.level.collectibles.forEach((collectible, index) => {
      if (
        collectible instanceof Bottle &&
        this.character.isColliding(collectible)
      ) {
        this.level.collectibles.splice(index, 1); // Flasche entfernen
        this.availableBottles = Math.min(this.availableBottles + 1, 5); // Maximal 5 Flaschen
        this.statusBarBottles.setPercentage(this.availableBottles * 20); // StatusBarBottles aktualisieren
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0); // back
    // ------ Space for fixed objects -------
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins); // Münzen-Statusleiste zeichnen
    this.addToMap(this.statusBarBottles); // Bottles-Statusleiste zeichnen

    this.ctx.translate(this.camera_x, 0); // forwards

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.level.collectibles);
    this.addObjectsToMap(this.throwableObjects);

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
