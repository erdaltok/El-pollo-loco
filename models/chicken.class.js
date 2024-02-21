class Chicken extends MovableObject {
  height = 60;
  width = 60;
  y = 361;
  x = 720;

 
  offset = {
    top: -18,
    left: 5,
    right: 5,
    bottom: 10,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  dead = false;
  isCollidable = true;
  moveInterval = null;
  animationInterval = null;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.20 + Math.random() * 0.28;
    this.animate();
  }

  setWorld(world) {
    this.world = world;
  }

  die() {
    console.log(`Chicken stirbt.`);
    this.dead = true;
    this.isCollidable = false;
    this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
        console.log(`Chicken entfernt.`);
      }
    }, 1000);
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 8);
  }
}
