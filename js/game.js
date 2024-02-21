let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = null;
  canvas.style.display = "none";

  document.getElementById("startButton").addEventListener("click", startGame);
  initMusicControls();
  initMobileControls(); 
}

function startGame() {
  loadLevel1(() => {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("youLostContainer").style.display = "none";
    document.getElementById("gameOverContainer").style.display = "none";
    document.getElementById("mobileControlContainer").style.display = "block";
    canvas.style.display = "block";

    if (!world) {
      world = new World(canvas, keyboard);
    } else {
      world.reset();
      world.resetEnemies();  
    }
    console.log("My Character is", world.character);
  });
  
}

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

function backToMenu() {
  document.getElementById("youLostContainer").style.display = "none";
  document.getElementById("gameOverContainer").style.display = "none";

  document.getElementById("startScreen").style.display = "block"; 
  document.getElementById("startButton").style.display = "block";
  document.getElementById("controlInstructions").style.left = "64%";
  document.getElementById("controlInstructions").style.top = "100px";
}

function handleCharacterDeath() {
  if (world.character.isDead()) {
    world.clearAllIntervals(); 
    world.resetEnemies();
    canvas.style.display = "none"; 
    document.getElementById("youLostContainer").style.display = "block";
    document.getElementById("mobileControlContainer").style.display = "none";
    document.getElementById("controlInstructions").style.left = "50%";
    document.getElementById("controlInstructions").style.top = "70px";
    world = null;     
  }
}

function handleEndbossDeath() {
  if (world) {
    world.clearAllIntervals(); 
    world.resetEnemies();

    canvas.style.display = "none"; 
    document.getElementById("gameOverContainer").style.display = "block";
    document.getElementById("mobileControlContainer").style.display = "none";
    document.getElementById("controlInstructions").style.left = "50%";
    document.getElementById("controlInstructions").style.top = "70px";
    world = null; 
  }
}

function initMusicControls() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const volumeOnIcon = document.getElementById('volumeOn');
    const volumeMuteIcon = document.getElementById('volumeMute');

    backgroundMusic.volume = 0.3; 
    backgroundMusic.pause();

    volumeOnIcon.addEventListener('click', () => {
        backgroundMusic.pause();
        volumeOnIcon.style.display = 'none';
        volumeMuteIcon.style.display = 'block';
    });

    volumeMuteIcon.addEventListener('click', () => {
        backgroundMusic.play();
        volumeMuteIcon.style.display = 'none';
        volumeOnIcon.style.display = 'block';
    });
}


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
  keyboardInstructions.style.width = "60px"
  keyboardInstructions.style.height = "60px"

  defaultScreenSize.style.width = "40px";
  defaultScreenSize.style.height = "40px";
  enterFullscreen(fullscreen);

  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("defaultScreenSize").style.display = "block";
}

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

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function openControlInstructions() {
  document.getElementById("controlInstructions").style.display = "block";
}

function closeControlInstructions() {
  document.getElementById("controlInstructions").style.display = "none";
}



window.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
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
  };
  
if (e.keyCode == "68") {
  keyboard.D = true;
    };

});


window.addEventListener('keyup', (e) => {
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







