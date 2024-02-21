class ThrowableObject extends MovableObject {
  height = 65;
  width = 55;
  bottleOnGround = false;
  bottle_smash_sound = new Audio("audio/bottle_smash_sound.mp3");

  offset = { top: +40, left: +40, right: +20, bottom: +40 };

  IMAGES_THROWABLEOBJECT_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_THROWABLEOBJECT_BOTTLE);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
  }

  throw(world) {
    if (world.availableBottles <= 0) return;
    this.bottleOnGround = false;
    this.speedY = 25;
    this.applyGravity();
    world.availableBottles--;
    world.statusBarBottles.setPercentage(world.availableBottles * 20);

    const animationInterval = setInterval(() => {
      this.x += 15;
      this.playAnimation(this.IMAGES_THROWABLEOBJECT_BOTTLE);

      if (this.y >= 380) {
        this.handleBottleLanding(animationInterval);
      }
      if (this.isColliding(world.endboss)) {
        clearInterval(animationInterval);
      }
    }, 1000 / 25);
  }

  handleBottleLanding(animationInterval) {
    if (!this.bottleOnGround) {
      this.y = 380;
      this.speedY = 0;
      this.bottleOnGround = true;
      clearInterval(animationInterval);
      this.playSplashAnimation();
      this.bottle_smash_sound.play();
    }
  }

  playSplashAnimation(callback) {
    this.speedY = 0; 
    this.speed = 0; 
    let animationIndex = 0;
    const animation = () => {
      if (animationIndex < this.IMAGES_BOTTLE_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_BOTTLE_SPLASH[animationIndex++]];
        setTimeout(animation, 1000 / 60);
      } else if (callback) {
        callback();
      }
    };
    animation();
  }
}

 








    
    
    

    
    
    
    

