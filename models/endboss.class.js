/**
 * Represents the Endboss in the game, extending the MovableObject class.
 */
class Endboss extends MovableObject {
  height = 320;
  width = 320;
  y = 123;
  energy = 100;
  hurtCooldown = 1200;
  lastHurtTime = 0;
  world;
  hitCount = 0;
  animationFrameCounter = 0;

  fryingChickenSound = new Audio("audio/frying_chicken_sound.mp3");
  wonGameSound = new Audio("audio/won_game_sound.mp3");

  offset = { top: +20, left: +40, right: +10, bottom: +10 };

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
  ];

  IMAGES_HURT_ENDBOSS = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Constructor for the Endboss class.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT_ENDBOSS);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 3400;
    this.animateMode = "alert";
    this.startAnimation();
    this.startModeChange();
  }

  /**
   * Starts the animation process for the endboss.
   */
  startAnimation() {
    clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
      this.updateAnimation();
    }, 1000 / 8);
  }

  /**
   * Updates the animation based on the current mode (alert, walking, attack).
   */
  updateAnimation() {
    if (this.animateMode === "dead") {
      clearInterval(this.animationInterval);
      return;
    }
    switch (this.animateMode) {
      case "alert":
        this.playAnimation(this.IMAGES_ALERT);
        break;
      case "walking":
        this.playAnimation(this.IMAGES_WALKING);
        break;
      case "attack":
        this.x -= this.speed;
        this.playAttackWalkingAnimation();
        this.attackCharacter();
        break;
    }
  }

  /**
   * Starts the mode change process, alternating between alert and walking modes.
   */
  startModeChange() {
    clearInterval(this.modeChangeInterval);
    this.modeChangeInterval = setInterval(() => {
      this.changeMode();
    }, 2000);
  }

  /**
   * Changes the mode between alert and walking.
   */
  changeMode() {
    if (this.animateMode === "dead") {
      clearInterval(this.modeChangeInterval);
      return;
    }

    if (this.animateMode === "alert") {
      this.animateMode = "walking";
      this.standardMovingEndboss();
    } else {
      this.animateMode = "alert";
    }
  }

  /**
   * Initiates the standard animation cycle for the endboss, alternating between alert and walking animations.
   */
  standardAnimationEndboss() {
    let alertDuration = 3000;
    let walkDuration = 2000;

    setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
      setTimeout(() => {
        this.standardMovingEndboss();
      }, alertDuration);
    }, alertDuration + walkDuration);
  }

  /**
   * Controls the standard movement behavior of the endboss when in walking mode.
   */
  standardMovingEndboss() {
    if (this.animateMode === "walking") {
      let moveDuration = 2000;
      let moveSpeed = this.movingLeft ? -this.speed : this.speed;
      let startTime = Date.now();

      let moveInterval = setInterval(() => {
        if (Date.now() - startTime < moveDuration) {
          this.x += moveSpeed;
        } else {
          clearInterval(moveInterval);
          this.movingLeft = !this.movingLeft;
        }
      }, 1000 / 60);
    }
  }

  /**
   * Plays the specified animation sequence for the endboss.
   * @param {Array} images - An array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Handles the endboss being hurt, triggering damage and potentially changing to attack mode.
   */
  isHurtEndboss() {
    const currentTime = Date.now();
    if (currentTime - this.lastHurtTime > this.hurtCooldown) {
      this.lastHurtTime = currentTime;
      this.reduceHealth();
      this.hitCount++;

      this.playAnimation(this.IMAGES_HURT_ENDBOSS);

      setTimeout(() => {
        if (this.hitCount >= 2) {
          this.endbossInAttackMode();
        }
      }, 1000);
    }
  }

  /**
   * Reduces the endboss's health and checks for death.
   */
  reduceHealth() {
    if (this.energy > 0) {
      this.energy -= 25;
      this.world.statusBarEndboss.setPercentage(this.energy);

      if (this.energy <= 0) {
        this.playDeathAnimation();
      }
    }
  }

  /**
   * Plays the death animation sequence for the endboss.
   */
  playDeathAnimation() {
    clearInterval(this.animationInterval);
    this.animateMode = "dead";

    let deathAnimationIndex = 0;
    let deathAnimationInterval = setInterval(() => {
      if (deathAnimationIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[deathAnimationIndex++]];
        this.fryingChickenSound.play();
      } else {
        clearInterval(deathAnimationInterval);
        this.wonGameSound.play();
        handleEndbossDeath();

        setTimeout(() => {
          this.fryingChickenSound.pause();
          this.resetEndboss();
        }, 3000);
      }
    }, 1000);
  }

  /**
   * Resets the endboss to its initial state for a new game or level.
   */
  resetEndboss() {
    this.x = 3400;
    this.energy = 100;
    this.hitCount = 0;
    this.animateMode = "alert";
    this.speed = 5;
    this.animationFrameCounter = 0;

    this.startAnimation();
    this.startModeChange();
  }

  /**
   * Switches the endboss to attack mode, increasing speed and changing behavior.
   */
  endbossInAttackMode() {
    if (this.animateMode !== "attack") {
      this.animateMode = "attack";
      this.speed = 5;
    }
  }

  /**
   * Plays a combined walking and attack animation for the endboss in attack mode.
   */
  playAttackWalkingAnimation() {
    if (this.animationFrameCounter % 2 === 0) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_ATTACK);
    }
    this.animationFrameCounter++;
  }

  /**
   * Moves the endboss towards the character, adjusting direction based on the character's position.
   */
  attackCharacter() {
    if (this.animateMode === "dead") {
      return;
    }

    if (this.world.character.x < this.x) {
      this.x -= this.speed;
    } else {
      this.x += this.speed;
    }
  }
}
