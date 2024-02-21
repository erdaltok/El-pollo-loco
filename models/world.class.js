class World {
  character = new Character();
  endboss = new Endboss();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  statusBarCoins = new StatusBarCoins();
  statusBarEndboss = new StatusBarEndboss();
  statusBarBottles = new StatusBarBottles();
  availableBottles = 0;
  movementTimeout = null;

  collect_coin_sound = new Audio("audio/pickupCoin.wav");
  endboss_hurt_sound = new Audio("audio/chicken-hurt.mp3");
  chickenSqueakSound = new Audio("audio/chicken_squeak_sound.mp3");
  collect_bottle_sound = new Audio("audio/collect_bottle_sound.mp3");
  bottle_smash_sound = new Audio("audio/bottle_smash_sound.mp3");

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss || enemy instanceof Chicken) {
        enemy.world = this;
      }
    });
  }

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas; 
    this.keyboard = keyboard;

    this.draw();
    this.level = level1;
    this.setWorld();
    this.createChickens();
    this.createChicks();
    this.addBottlesOnGround();
    this.addCoins();
    this.run();  
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsWithCoins();
      this.checkCollisionWithBottles();
      this.checkThrowObjects();
      this.checkBottleHitsEndboss();
    }, 200);
  }

  clearAllIntervals() {
    for (let i = 1; i < 999999; i++) window.clearInterval(i);
  }

  reset() {
    this.character = new Character();
    this.endboss = new Endboss();
    this.endboss.resetEndboss(); 

    this.throwableObjects = [];
    this.statusBar.reset();
    this.statusBarCoins.reset();
    this.statusBarEndboss.reset();
    this.statusBarBottles.reset();
    this.availableBottles = 0;

    this.setWorld();
    this.createChickens();
    this.createChicks();
    this.addBottlesOnGround();
    this.addCoins();

    this.camera_x = 0;
  }

  resetEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) => !(e instanceof Chicken || e instanceof Chicks)
    );
   
    this.level.collectibles = this.level.collectibles.filter(
      (c) => !(c instanceof Coin || c instanceof Bottle)
    );
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.availableBottles > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      bottle.throw(this);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isCollidable && this.character.isColliding(enemy)) {
        if (enemy instanceof Chicken && this.jumpOnChicken(enemy)) {
          enemy.die();
          this.chickenSqueakSound.play();
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  jumpOnChicken(enemy) {
    return (
      enemy instanceof Chicken &&
      this.character.isColliding(enemy) &&
      this.character.isAboveGround() &&
      this.character.speedY < 0
    );
  }

  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
          console.log("Bottle hits Endboss");
          enemy.isHurtEndboss();
          this.bottle_smash_sound.play();
          bottle.playSplashAnimation(() => {
            this.throwableObjects.splice(index, 1);
          });
          this.endboss_hurt_sound.play();
        }
      });
    });
  }

  checkCollisionsWithCoins() {
    this.level.collectibles.forEach((collectible, index) => {
      if (
        collectible instanceof Coin &&
        this.character.isColliding(collectible)
      ) {
        this.level.collectibles.splice(index, 1); 
        this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
        this.collect_coin_sound.play();
        if (this.statusBarCoins.percentage >= 100) {
          this.statusBar.setPercentage(100); 
          this.statusBarCoins.setPercentage(0); 
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
        this.collect_bottle_sound.play();
        this.level.collectibles.splice(index, 1); 
        this.availableBottles = Math.min(this.availableBottles + 1, 5); 
        this.statusBarBottles.setPercentage(this.availableBottles * 20); 
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0); 
    // ------ Space for fixed objects -------
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins); 
    this.addToMap(this.statusBarBottles); 
    this.addToMap(this.statusBarEndboss); 

    this.ctx.translate(this.camera_x, 0); 

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.level.collectibles);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this; 
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
      chicken.setWorld(this); 
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
