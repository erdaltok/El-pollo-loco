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

  isAboveGround() {
    return this.y < 177;
  }

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

  stopWalkingSound() {
    this.walking_sound.pause();
    this.walking_sound.currentTime = 0; 
  }

  resetIdleState() {
    this.fallAsleep = 0;
    this.longIdleCounter = 0;
    this.idleCounter = 0;
    this.manageSnoringSound(false);
  }

  incrementIdleState() {
    this.fallAsleep += 1;
    if (this.fallAsleep > 600) {
      this.longIdleCounter++;
      this.idleCounter++;
    }
  }

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

  handleDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    this.characterSnoringSound.pause();
    this.looseGameSound.play();
    
  }

  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.characterSnoringSound.pause();
    this.characterHurtSound.play();
  }

  handleJumpingAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  handleLongIdleAnimation() {
    if (this.longIdleCounter % this.longIdleAnimationSpeed === 0) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
      this.manageSnoringSound(true);
    }
  }

  handleIdleAnimation() {
    if (this.idleCounter % this.idleAnimationSpeed === 0) {
      this.playAnimation(this.IMAGES_IDLE);
      this.manageSnoringSound(false);
    }
  }

  handleWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

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
