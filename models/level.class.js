class Level {
  enemies;
  clouds;
  backgroundObjects;
  collectibles; 
  level_end_x = 3500;

  constructor(enemies, clouds, backgroundObjects, collectibles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectibles = collectibles;
  }
}
