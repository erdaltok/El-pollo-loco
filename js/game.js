let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = false;

/**
 * Initializes the game by setting up the canvas, hiding it initially, and initializing game controls.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = null;
  canvas.style.display = "none";

  document.getElementById("startButton").addEventListener("click", startGame);
  initMusicControls();
  initMobileControls();
}

/**
 * Starts the game by loading the first level, hiding the start screen, and displaying the game canvas.
 */
function startGame() {
  loadLevel1(() => {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("youLostContainer").style.display = "none";
    document.getElementById("gameOverContainer").style.display = "none";
    document.getElementById("mobileControl").style.display = "flex";
    document.getElementById("keyboardInstructions").style.display = "none";

    canvas.style.display = "block";

    if (!world) {
      world = new World(canvas, keyboard);
    } else {
      world.reset();
      world.resetEnemies();      
    }
    toggleGameSounds(soundEnabled);// Stellen Sie sicher, dass die Soundeinstellungen beim Spielstart angewendet werden
  });
 
}

/**
 * Loads the first level of the game. If the level script is not already loaded, it dynamically loads it.
 * @param {Function} callback - Function to call after the level is loaded.
 */
function loadLevel1(callback) {
  if (typeof level1 === "undefined") {
    const script = document.createElement("script");
    script.src = "levels/level1.js";
    script.onload = () => callback();
    document.head.appendChild(script);
  } else {
    callback();
  }
}

/**
 * Returns to the main menu, hiding the game over and you lost containers, and showing the start screen.
 */
function backToMenu() {
  document.getElementById("youLostContainer").style.display = "none";
  document.getElementById("gameOverContainer").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("startButton").style.display = "block";
  document.getElementById("controlInstructions").style.left = "64%";
  document.getElementById("controlInstructions").style.top = "100px";
  document.getElementById("mobileControl").style.display = "none";
   document.getElementById("keyboardInstructions").style.display = "flex";
}

/**
 * Handles the character's death by clearing all intervals, resetting enemies, and showing the "you lost" screen.
 */
function handleCharacterDeath() {
  if (world && world.character.isDead()) {
    world.character.stopCharacterIntervals();    
    world.resetEnemies();   

    canvas.style.display = "none";
    document.getElementById("youLostContainer").style.display = "block";
    document.getElementById("mobileControl").style.display = "none";
    document.getElementById("controlInstructions").style.left = "50%";
    document.getElementById("controlInstructions").style.top = "70px";
    world = null;
  }
}

/**
 * Handles the end boss's death by clearing all intervals, resetting enemies, and showing the game over screen.
 */
function handleEndbossDeath() {
  if (world) {
    world.clearAllIntervals();
    world.resetEnemies();

    canvas.style.display = "none";
    document.getElementById("gameOverContainer").style.display = "block";
    document.getElementById("mobileControl").style.display = "none";
    document.getElementById("controlInstructions").style.left = "50%";
    document.getElementById("controlInstructions").style.top = "70px";
    world = null;
  }
}

/**
 * Initializes music controls for the game. This includes setting up the initial display state for the volume icons
 * (on or mute) based on whether the sound is enabled. It also controls the playback of the background music
 * based on the sound settings and adds event listeners to the volume icons for toggling the sound.
 */
function initMusicControls() {
  const backgroundMusic = document.getElementById("backgroundMusic");
  const volumeOnIcon = document.getElementById("volumeOn");
  const volumeMuteIcon = document.getElementById("volumeMute");
  volumeOnIcon.style.display = soundEnabled ? "block" : "none";
  volumeMuteIcon.style.display = soundEnabled ? "none" : "block";

  backgroundMusic.volume = 0.3;
  if (soundEnabled) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }  
  volumeOnIcon.addEventListener("click", () => {
    toggleSound();
  });
  volumeMuteIcon.addEventListener("click", () => {
    toggleSound();
  });
}

/**
 * Toggles the sound on or off. This function updates the sound setting, plays or pauses the background music
 * accordingly, and switches the displayed volume icon. It is called when the user clicks on one of the volume icons.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  const backgroundMusic = document.getElementById("backgroundMusic");
  if (soundEnabled) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }

  document.getElementById("volumeOn").style.display = soundEnabled
    ? "block"
    : "none";
  document.getElementById("volumeMute").style.display = soundEnabled
    ? "none"
    : "block";

  if (world) {
    toggleGameSounds(soundEnabled);
  }
}

/**
 * Toggles the muting of game sounds based on the provided enable parameter. When enable is true,
 * all game sounds will be active (unmuted), and when false, all game sounds will be muted. This
 * function is used to control the overall sound settings of the game, affecting various sound effects
 * @param {boolean} enable - A boolean flag indicating whether to enable (unmute) or disable (mute) game sounds.
 */
function toggleGameSounds(enable) {
  world.walking_sound.muted = !enable;
  world.characterHurtSound.muted = !enable;
  world.characterSnoringSound.muted = !enable;
  world.looseGameSound.muted = !enable;
  world.characterDeathSound.muted = !enable;
  world.collect_coin_sound.muted = !enable;
  world.endboss_hurt_sound.muted = !enable;
  world.chickenSqueakSound.muted = !enable;
  world.collect_bottle_sound.muted = !enable;
  world.bottle_smash_sound.muted = !enable;
  world.wonGameSound.muted = !enable;
  world.fryingChickenSound.muted = !enable;
}

/**
 * Enters fullscreen mode for the game, adjusting the display settings for a fullscreen experience.
 */
function fullscreen() {
  let fullscreen = document.getElementById("canvasContainer");
  let startScreen = document.getElementById("startScreen");
  let startButton = document.getElementById("startButton");
  let volumeOn = document.getElementById("volumeOn");
  let keyboardInstructions = document.getElementById("keyboardInstructions");
  let defaultScreenSize = document.getElementById("defaultScreenSize");

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  startScreen.style.width = "100%";
  startScreen.style.height = "100%";
  startButton.style.fontSize = "80px";
  startButton.style.top = "70px";
  volumeOn.style.width = "60px";
  volumeOn.style.height = "60px";
  volumeMute.style.width = "60px";
  volumeMute.style.height = "60px";
  keyboardInstructions.style.width = "60px";
  keyboardInstructions.style.height = "60px";
  defaultScreenSize.style.width = "40px";
  defaultScreenSize.style.height = "40px";
  enterFullscreen(fullscreen);

  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("defaultScreenSize").style.display = "block";
}

/**
 * Exits fullscreen mode and returns to the default screen size and layout.
 */
function defaultScreen() {
  exitFullscreen();
  startButton.style.fontSize = "";
  startButton.style.top = "";
  volumeOn.style.width = "";
  volumeOn.style.height = "";
  volumeMute.style.width = "";
  volumeMute.style.height = "";
  keyboardInstructions.style.width = "";
  keyboardInstructions.style.height = "";

  defaultScreenSize.style.width = "";
  defaultScreenSize.style.height = "";

  document.getElementById("fullscreen").style.display = "block";
  document.getElementById("defaultScreenSize").style.display = "none";
}

/**
 * Requests the browser to enter fullscreen mode for the specified element.
 * @param {HTMLElement} element - The element to display in fullscreen mode.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    // for IE11 (remove June 15, 2022)
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    // iOS Safari
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode if currently active in the browser.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Displays the control instructions overlay.
 */
function openControlInstructions() {
  document.getElementById("controlInstructions").style.display = "block";
}

/**
 * Hides the control instructions overlay.
 */
function closeControlInstructions() {
  document.getElementById("controlInstructions").style.display = "none";
}

window.addEventListener("keydown", (e) => {
  // console.log(e.keyCode);
  if (e.keyCode == "38") {
    keyboard.UP = true;
  }

  if (e.keyCode == "40") {
    keyboard.DOWN = true;
  }

  if (e.keyCode == "37") {
    keyboard.LEFT = true;
  }

  if (e.keyCode == "39") {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == "32") {
    keyboard.SPACE = true;
  }

  if (e.keyCode == "68") {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == "38") {
    keyboard.UP = false;
  }

  if (e.keyCode == "40") {
    keyboard.DOWN = false;
  }

  if (e.keyCode == "37") {
    keyboard.LEFT = false;
  }

  if (e.keyCode == "39") {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == "32") {
    keyboard.SPACE = false;
  }

  if (e.keyCode == "68") {
    keyboard.D = false;
  }
  if (e.keyCode == "37" || e.keyCode == "39") {
    if (world && world.character) {
      world.character.stopWalkingSound();
    }
  }
});

/**
 * Initializes mobile controls by adding touch event listeners to the control buttons.
 */
function initMobileControls() {
  const btnThrow = document.getElementById("btn-throw");
  const btnUp = document.getElementById("btn-up");
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");

  btnThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  btnThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });

  btnUp.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  btnUp.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });
}
