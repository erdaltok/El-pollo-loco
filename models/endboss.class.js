class Endboss extends MovableObject {
  height = 320;
  width = 320;
  y = 123;
  energy = 100;
  dead = false;
  speed = 0;
  intervalIds = [];
  hitCount = 0;
  vulnerable = true;

  offset = { top: 35, left: 55, right: 55, bottom: 20 };

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
    this.animate();
    this.state = "moveLeft";
    this.lastStateChange = Date.now();
    this.alertImageIndex = 0;
    this.isHurtAnimationPlaying = false;
  }

  /**
   * Initializes the animation process by calling the standard animation function.
   */
  animate() {
    this.standardAnimation();
  }

  /**
   * Defines the standard animation loop for the object. It repeatedly checks the current state of the object
   * and applies the appropriate behavior based on that state. The possible states include moving left, being alert, and moving right.
   * This function schedules the animation to be updated 13 times per second.
   */
  standardAnimation() {
    const animation = () => {
      const now = Date.now();
      switch (this.state) {
        case "moveLeft":
          this.handleMoveLeft();
          break;
        case "alert":
          this.handleAlert();
          break;
        case "moveRight":
          this.handleMoveRight();
          break;
      }
    };
    const intervalId = setInterval(animation, 1000 / 13);
    this.intervalIds.push(intervalId);
  }

  /**
   * Handles the behavior when the object is moving left. It switches to the alert state after 2 seconds,
   * or continues moving left and playing the walking animation otherwise.
   */
  handleMoveLeft() {
    const now = Date.now();
    if (now - this.lastStateChange >= 2000) {
      this.speed = 0;
      this.state = "alert";
      this.lastStateChange = now;
      this.alertImageIndex = 0;
    } else {
      this.speed = 3.5;
      this.moveLeft();
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Handles the behavior when the object is in the alert state. It switches to the moving right state after 2 seconds,
   * or cycles through alert images based on a calculated interval.
   */
  handleAlert() {
    const now = Date.now();
    const alertInterval = 2000 / this.IMAGES_ALERT.length;
    if (now - this.lastStateChange >= 2000) {
      this.state = "moveRight";
      this.lastStateChange = now;
    } else if (
      now - this.lastStateChange >=
      this.alertImageIndex * alertInterval
    ) {
      if (this.alertImageIndex < this.IMAGES_ALERT.length) {
        this.img = this.imageCache[this.IMAGES_ALERT[this.alertImageIndex++]];
      }
    }
  }

  /**
   * Handles the behavior when the object is moving right. It switches to the moving left state after 2 seconds,
   * or continues moving right and playing the walking animation otherwise.
   */
  handleMoveRight() {
    const now = Date.now();
    if (now - this.lastStateChange >= 2000) {
      this.state = "moveLeft";
      this.lastStateChange = now;
    } else {
      this.speed = 3.5;
      this.moveRight();
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Reduces the endboss's health and checks for death.
   */
  reduceHealth() {
    if (this.energy > 0) {
      this.energy -= 25;
      this.world.statusBarEndboss.setPercentage(this.energy);
    }
  }

  /**
   * Handles the endboss being hurt, triggering damage and potentially changing to attack mode.
   */
  isHurtEndboss() {
    if (!this.dead && !this.isHurtAnimationPlaying) {
      this.reduceHealth();
      this.hitCount++;

      if (this.hitCount === 4) {
        this.playDeathAnimation();
        return;
      }
      this.playHurtAnimation();

      if (this.hitCount === 2) {
        this.speed = 1;
      } else if (this.hitCount === 3) {
        this.speed = 1.5;
      }
    }
  }

  /**
   * Plays the hurt animation for the object. It stops all other animations, iterates through the hurt images,
   * and sets up a new interval for playing the animation. Once the animation is complete, it checks if the object
   * is not dead and has less than 4 hits to decide the next action.
   */
  playHurtAnimation() {
    this.isHurtAnimationPlaying = true;
    this.stopAllAnimations();
    const animationDuration = 500;
    const frames = this.IMAGES_HURT_ENDBOSS.length;
    const intervalTime = animationDuration / frames;
    let currentFrame = 0;

    const hurtAnimationInterval = setInterval(() => {
      if (currentFrame < frames) {
        this.img = this.imageCache[this.IMAGES_HURT_ENDBOSS[currentFrame++]];
      } else {
        clearInterval(hurtAnimationInterval);
        this.isHurtAnimationPlaying = false;
        if (!this.dead && this.hitCount < 4) {
          this.playAttackAnimation();
        }
      }
    }, intervalTime);
    this.intervalIds.push(hurtAnimationInterval);
  }

  /**
   * Plays the attack animation for the object. Stops all other animations first, then iterates through
   * the attack images at a set interval. After completing the animation, it triggers the walking animation.
   */
  playAttackAnimation() {
    this.stopAllAnimations();
    let currentFrame = 0;
    const frames = this.IMAGES_ATTACK.length;
    const intervalTime = 500 / frames;

    const attackAnimationInterval = setInterval(() => {
      if (currentFrame < frames) {
        this.img = this.imageCache[this.IMAGES_ATTACK[currentFrame++]];
      } else {
        clearInterval(attackAnimationInterval);
        this.isHurtAnimationPlaying = false;
        this.speed = 20;
        this.playWalkingAnimation();
      }
    }, intervalTime);
    this.intervalIds.push(attackAnimationInterval);
  }

  /**
   * Plays the death animation for the object. Stops all animations, sets speed to 0, and iterates through
   * the death images at a set interval. After completing the animation, it triggers the afterDeath method.
   */
  playDeathAnimation() {
    this.stopAllAnimations();
    this.speed = 0;

    let currentFrame = 0;
    const frames = this.IMAGES_DEAD.length;
    const intervalTime = 800 / frames;
    this.dead = true;

    const deathAnimationInterval = setInterval(() => {
      if (currentFrame < frames) {
        this.img = this.imageCache[this.IMAGES_DEAD[currentFrame++]];
        this.world.fryingChickenSound.play();
      } else {
        clearInterval(deathAnimationInterval);
        this.afterDeath();
      }
    }, intervalTime);
    this.intervalIds.push(deathAnimationInterval);
  }

  /**
   * Handles actions to be performed after the death animation completes, such as stopping sounds and playing
   * the victory sound.
   */
  afterDeath() {
    setTimeout(() => {
      this.world.fryingChickenSound.pause();
      this.world.characterSnoringSound.pause();
      this.world.wonGameSound.play();
      handleEndbossDeath();
    }, 1000);
  }

  /**
   * Initiates the walking animation. Stops any current animations and sets up an interval to iterate
   * through walking images, updating the object's position to the left based on its speed.
   */
  playWalkingAnimation() {
    this.stopAllAnimations();

    const walkingAnimationInterval = setInterval(() => {
      this.moveLeft();
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 15);

    this.intervalIds.push(walkingAnimationInterval);
  }

  /**
   * Moves the object to the left by decreasing its x-coordinate based on its current speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Stops all currently running animations for this object. Clears all intervals associated
   * with animations to halt any ongoing animated movement or actions.
   */
  stopAllAnimations() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
  }
}
