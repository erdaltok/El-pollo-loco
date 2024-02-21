/**
 * Represents a game level with its components such as enemies, clouds, background objects, and collectibles.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  collectibles;
  level_end_x = 3500;

  /**
   * Constructs a new Level instance with specified components.
   * @param {Array} enemies - An array of enemy objects present in the level.
   * @param {Array} clouds - An array of cloud objects for background animation.
   * @param {Array} backgroundObjects - An array of background objects for the level's scenery.
   * @param {Array} collectibles - An array of collectible items present in the level.
   */
  constructor(enemies, clouds, backgroundObjects, collectibles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectibles = collectibles;
  }
}
