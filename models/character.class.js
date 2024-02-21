/**
 * Represents the main character in the game.
 * This class extends MovableObject to include movement and animation capabilities.
 */
class Character extends MovableObject {
  height = 250;
  width = 130;
  y = 177;
  speed = 4;

  offset = {
    top: 150,
    left: 45,
    right: 45,
    bottom: 35,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  walking_sound = new Audio("audio/running.mp3");
  characterHurtSound = new Audio("audio/character_hurt_sound.mp3");
  characterSnoringSound = new Audio("audio/snoring-sound.mp3");
  looseGameSound = new Audio("audio/loose_game_sound.mp3");

  fallAsleep = 0;
  longIdleCounter = 0;
  longIdleAnimationSpeed = 4;
  idleAnimationSpeed = 10;
  idleCounter = 0;
  longIdleAnimationSpeed = 8;

  /**
   * Constructor for the Character class.
   * Loads initial images, sets gravity, and starts the animation loop.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_IDLE);
    this.isSnoring = false;
    this.applyGravity();
    this.animate();
  }

  /**
   * Checks if the character is above the ground.
   * @returns {boolean} True if the character is in the air.
   */
  isAboveGround() {
    return this.y < 177;
  }

  /**
   * Updates the character's movement state based on keyboard input.
   */
  updateMovementState() {
    let isMoving = false;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.walking_sound.play();
      isMoving = true;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.walking_sound.play();
      isMoving = true;
    }

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      isMoving = true;
    }

    if (isMoving) {
      this.resetIdleState();
    } else {
      this.incrementIdleState();
    }
  }

  /**
   * Stops the walking sound effect.
   */
  stopWalkingSound() {
    this.walking_sound.pause();
    this.walking_sound.currentTime = 0;
  }

  /**
   * Resets the character's idle state counters and snoring sound.
   */
  resetIdleState() {
    this.fallAsleep = 0;
    this.longIdleCounter = 0;
    this.idleCounter = 0;
    this.manageSnoringSound(false);
  }

  /**
   * Increments the character's idle state counters.
   */
  incrementIdleState() {
    this.fallAsleep += 1;
    if (this.fallAsleep > 600) {
      this.longIdleCounter++;
      this.idleCounter++;
    }
  }

  /**
   * Manages the playing and stopping of the snoring sound.
   * @param {boolean} shouldSnore - Determines if the snoring sound should play.
   */
  manageSnoringSound(shouldSnore) {
    if (shouldSnore && !this.isSnoring) {
      this.characterSnoringSound.play();
      this.isSnoring = true;
    } else if (!shouldSnore && this.isSnoring) {
      this.characterSnoringSound.pause();
      this.characterSnoringSound.currentTime = 0;
      this.isSnoring = false;
    }
  }

  /**
   * Plays the character's death animation and sound.
   */
  handleDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    this.characterSnoringSound.pause();
    this.looseGameSound.play();
  }

  /**
   * Plays the character's hurt animation and sound.
   */
  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.characterSnoringSound.pause();
    this.characterHurtSound.play();
  }

  /**
   * Plays the character's jumping animation.
   */
  handleJumpingAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Plays the character's lond idle animation and sound.
   */
  handleLongIdleAnimation() {
    if (this.longIdleCounter % this.longIdleAnimationSpeed === 0) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
      this.manageSnoringSound(true);
    }
  }

  /**
   * Plays the character's idle animation and sound.
   */
  handleIdleAnimation() {
    if (this.idleCounter % this.idleAnimationSpeed === 0) {
      this.playAnimation(this.IMAGES_IDLE);
      this.manageSnoringSound(false);
    }
  }

  /**
   * Plays the character's walking animation.
   */
  handleWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Plays all character's animation.
   */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.handleDeathAnimation();
      this.manageSnoringSound(false);
    } else if (this.isHurt()) {
      this.handleHurtAnimation();
    } else if (this.isAboveGround()) {
      this.handleJumpingAnimation();
    } else if (this.longIdleCounter > 180) {
      this.handleLongIdleAnimation();
    } else if (this.fallAsleep > 60) {
      this.handleIdleAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.handleWalkingAnimation();
    } else {
      this.manageSnoringSound(false);
    }
  }

  /**
   * Main animation loop for the character.
   * Updates movement state and plays the appropriate animation.
   */
  animate() {
    setInterval(() => {
      this.updateMovementState();
      this.correctLanding();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      this.playCharacterAnimation();
      handleCharacterDeath();
    }, 50);
  }
}
