/**
 * Represents the game world, including characters, enemies, collectibles, and the game environment.
 */
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

  wonGameSound = new Audio("audio/won_game_sound.mp3");
  fryingChickenSound = new Audio("audio/frying_chicken_sound.mp3");

  walking_sound = new Audio("audio/running.mp3");
  characterHurtSound = new Audio("audio/character_hurt_sound.mp3");
  characterSnoringSound = new Audio("audio/snoring-sound.mp3");
  looseGameSound = new Audio("audio/loose_game_sound.mp3");
  characterDeathSound = new Audio("audio/characterDeathSound.mp3");

  /**
   * Sets the world context for characters and enemies.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (
        enemy instanceof Endboss ||
        enemy instanceof Chicken ||
        enemy instanceof Chicks
      ) {
        enemy.world = this;
      }
    });
  }

  /**
   * Constructs the game world with a canvas and keyboard input.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
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

  /**
   * Runs the game logic, checking for collisions and updating the game state.
   */
  run() {
    setInterval(() => {
      this.checkCollisionsCharacterWithEnemies();
      this.checkCollisionsWithCoins();
      this.checkCollisionWithBottles();
      this.checkThrowObjects();
      this.checkBottleHitsEndboss();
      this.checkBottleHitsChickenAndChicks();
    }, 200);
  }

  /**
   * Clears all intervals, stopping all ongoing animations and movements.
   */
  clearAllIntervals() {
    for (let i = 1; i < 999999; i++) window.clearInterval(i);
  }

  /**
   * Resets the game world to its initial state.
   */
  reset() {
    this.character = new Character();
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
    this.endboss = new Endboss();

    this.camera_x = 0;
  }

  /**
   * Resets the enemies in the game world.
   */
  resetEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) => !(e instanceof Chicken || e instanceof Chicks)
    );

    this.level.collectibles = this.level.collectibles.filter(
      (c) => !(c instanceof Coin || c instanceof Bottle)
    );
  }

  /**
   * Checks and handles the throwing of objects by the character.
   */
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

  /**
   * Checks for collisions between the character and enemies within the level.
   * If a collision is detected with a chicken or chick, it determines if the character is jumping on the enemy.
   * If the character successfully jumps on the enemy, the enemy is marked as dead, and a sound effect plays.
   * If the collision does not involve jumping on the enemy, the character takes damage, and its energy level is updated.
   */
  checkCollisionsCharacterWithEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isCollidable && this.character.isColliding(enemy)) {
        if (
          (enemy instanceof Chicken || enemy instanceof Chicks) &&
          this.jumpOnEnemy(enemy)
        ) {
          enemy.die();
          this.chickenSqueakSound.play();
        } else if (!enemy.dead) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  /**
   * Determines if the character is successfully jumping on an enemy.
   * This is true if the character is above the ground and moving downwards (speedY < 0).
   * @param {MovableObject} enemy - The enemy object the character might be jumping on.
   * @returns {boolean} True if the character is jumping on the enemy, false otherwise.
   */
  jumpOnEnemy(enemy) {
    return this.character.isAboveGround() && this.character.speedY < 0;
  }

  /**
   * Checks for collisions between throwable objects and the endboss, handling any interactions.
   */
  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
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

  /**
   * Checks for collisions between thrown bottles and chicken or chick enemies.
   * If a collision is detected, it triggers the death of the chicken or chick, plays a sound effect,
   * and then removes the bottle from the game by playing its splash animation and deleting it from the array of throwable objects.
   */
  checkBottleHitsChickenAndChicks() {
    this.throwableObjects.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (
          (enemy instanceof Chicken || enemy instanceof Chicks) &&
          bottle.isColliding(enemy)
        ) {
          if (enemy instanceof Chicken) {
            enemy.die();
          } else if (enemy instanceof Chicks) {
            enemy.die();
          }
          this.bottle_smash_sound.play();
          bottle.playSplashAnimation(() => {
            this.throwableObjects.splice(index, 1);
          });
          this.chickenSqueakSound.play();
        }
      });
    });
  }

  /**
   * Checks for collisions between the character and coins, handling any interactions.
   */
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

  /**
   * Checks for collisions between the character and bottles, handling any interactions.
   */
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

  /**
   * Draws all game objects to the canvas, updating the game's visual state.
   */
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

  /**
   * Adds an array of objects to the map for rendering.
   * @param {Array<MovableObject>} objects - The objects to add to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single movable object to the map for rendering.
   * @param {MovableObject} mo - The movable object to add to the map.
   */
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

  /**
   * Flips the image of a movable object for rendering in the opposite direction.
   * @param {MovableObject} mo - The movable object whose image to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image of a movable object after being flipped.
   * @param {MovableObject} mo - The movable object whose image to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Creates chicken enemies and adds them to the game world.
   */
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

  /**
   * Creates chick enemies and adds them to the game world.
   */
  createChicks() {
    let startPosition = 780;
    let endPosition = 3050;
    let spacing = 450;

    for (let x = startPosition; x <= endPosition; x += spacing) {
      let chicks = new Chicks();
      chicks.x = x;
      chicks.setWorld(this);

      this.level.enemies.push(chicks);
    }
  }

  /**
   * Adds bottles to the ground as collectibles in the game world.
   */
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

  /**
   * Adds coins as collectibles in the game world.
   */
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
