class ThrowableObject extends MovableObject {
  height = 65;
  width = 55;

  IMAGES_THROWABLEOBJECT_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_THROWABLEOBJECT_BOTTLE);
    this.x = x;
    this.y = y;
  }


  throw(world) {
    if (world.availableBottles > 0) {
      this.speedY = 27;
      this.applyGravity();
      setInterval(() => {
        this.x += 23;
        this.playAnimation(this.IMAGES_THROWABLEOBJECT_BOTTLE);
      }, 1000 / 25);
      world.availableBottles--; // Eine Flasche verbrauchen
      world.statusBarBottles.setPercentage(world.availableBottles * 20); // StatusBarBottles aktualisieren
    }
  }
}



    
    
    

    
    
    
    

