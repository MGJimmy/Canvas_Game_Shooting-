//====================================================
//====================== CLASSES =====================
//====================================================

//====================
// Player lass 
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  // function to draw the player
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color
    c.fill();
  }
}

//====================
// Projectile class
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // function to draw the projectile
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color
    c.fill();
  }

  // update our projectile position by animate
  update() {
    this.draw(); // call draw method when use update method of projectile
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//====================
// Particales class
const fraction = 0.99; // to make particale move slowly evey update  (velocity * fraction) 
class Particale {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  // function to draw the Particales
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color
    c.fill();
    c.restore();
  }

  // update our Particales position by animate
  update() {
    this.draw(); // call draw method when use update method of Particales
    this.velocity.x *= fraction;
    this.velocity.y *= fraction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01; // for fadeout effect
  }
}

//====================
// Enemy class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // function to draw the projectile
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color
    c.fill();
  }

  // update our projectile position by animate
  update() {
    this.draw(); // call draw method when use update method of projectile
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}


// if this is first time to play put store high score = 0 in localstorage
if (localStorage.getItem("highestScore") === null) {
  localStorage.setItem("highestScore", 0);
}

//================================
// Canvas options 
//================================
// get the canvas element
const canvas = document.querySelector("canvas");
// get the context of the canvas
var c = canvas.getContext("2d");
// make the canvas full screen "to be responsive"
canvas.height = innerHeight;
canvas.width = innerWidth;
// change canvas dimentions on resize "to be responsive"
window.onresize = function () {
  canvas.height = innerHeight;
  canvas.width = innerWidth;
}
// get the middle coords of the screen "canvas"
const centerx = canvas.width / 2;
const centery = canvas.height / 2;


//===========================
// Creating player & arrays
//===========================
// Create the player with specific style
const player = new Player(centerx, centery, 15, "#fff");
// Arrays for projectiles and enemies and particales
let allProjectiles = [];
let allEnemies = [];
let allParticales = [];


//===========================
// Game options
//===========================
let hitPower = 5;
let generateEnemyTime = 2000; // we use it in setInterval
let score = 0;
let projectileSpeed = 7;
let enemySpeed = 2;
let particaleSpeed = 10;

//===========================
// Get html elements
//===========================
//Menus elements
const liveScore = document.getElementById("liveScore");
const finalScore = document.getElementById("finalScore");
const startGameOptions = document.getElementById("startGameOptions");
const gameOverOptions = document.getElementById("gameOverOptions");
const pauseGameMenuElem = document.getElementById("pauseGameMenuElem");

const highestScoreDivs = document.querySelectorAll(".highestScore");
const difficultyLevel = document.querySelectorAll("#difficultyLevel span");

// Buttons
const startBtn = document.getElementById("startBtn");
const pauseGameBtn = document.getElementById("pauseGameBtn");
const resumeBtn = document.getElementById("resumeBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const soundControl = document.querySelectorAll('.soundControl');
const soundControlGame = document.getElementById('soundControlGame');
const homeBtns = document.querySelectorAll('.homeBtn');

// Sounds audio elements
const backgroudSound = document.getElementById("backgroudSound");
const fireSound = document.getElementById("fireSound");
const pauseMenuSound = document.getElementById("pauseMenuSound");
const playerDieSound = document.getElementById("playerDieSound");

//=============================
// used flags & variables
//============================
// interval variables
let frameNumber;
let enemyInterval;
let pauseMenuTimeOut;
let browserFocusInterval;
// Flags 
let gameStarted = false;
let gamedMuted = false;
let difficultyLevelFlag = 'normal';
let enemyKilled = false;

//==========================
// Highest score
// get the highest score from local storage
// put it's value in highest score divs   
//==========================
getHighestScore();

//==========================
// Game control
//==========================
// Muted Music
soundControl.forEach((soundBtn) => {
  soundBtn.addEventListener('click', () => {
    if (gamedMuted) {
      soundsOn();
    } else {
      soundsOff();
    }
  });
});

//Clicking home buttons to go to home menu
homeBtns.forEach((homeBtn) => {
  homeBtn.addEventListener('click', () => {
    gameOverOptions.classList.add("hidden");
    pauseGameMenuElem.classList.add("hidden");
    startGameOptions.classList.remove("hidden"); 
  });
});

// Start the game 
startBtn.addEventListener('click', function () {
  startGameOptions.classList.add("hidden"); // hide start game menu
  liveScore.classList.remove("hidden"); // Show live score
  soundControlGame.classList.remove("hidden"); // Show sound icon
  pauseGameBtn.classList.remove("hidden"); // Show puase icon
  
  startTheGame();
});
// Pause the game 
pauseGameBtn.addEventListener('click', () => {
  pauseGameMenuElem.classList.remove("hidden"); // Show pause menu
  soundControlGame.classList.add("hidden"); // Hide sound icon 
  pauseGameBtn.classList.add("hidden"); // Hide pause icon
  pauseTheGame();
});
// Resume the gama
resumeBtn.addEventListener('click', () => {
  pauseGameMenuElem.classList.add("hidden"); // Hide pause menu 
  soundControlGame.classList.remove("hidden"); // Show sound icon
  pauseGameBtn.classList.remove("hidden"); // Show pause icon

  resumeTheGame();
});
// Play Again function
playAgainBtn.addEventListener('click', () => {
  gameOverOptions.classList.add("hidden"); // Hide gameover menu
  liveScore.classList.remove("hidden"); // Show live score
  soundControlGame.classList.remove("hidden"); // Show sound icon
  pauseGameBtn.classList.remove("hidden"); // Show puase icon
  startTheGame();
});


// Difficulty level flag changes on click easy || normal || hard
difficultyLevel.forEach((level)=>{
  level.addEventListener('click', (event)=>{
    difficultyLevelFlag = event.target.getAttribute("data-level");
    let siblings = getAllSiblings(event.target);
    for (let i = 0; i < siblings.length; i++){
      siblings[i].classList.remove("active");
    }
    event.target.classList.add("active");
  });
});


// Create projectile on clicking window
canvas.addEventListener('click', function (event) {
  CreateProjectile(event.clientX, event.clientY);
  // fire sound 
  fireSound.play();
});

// Stop the sound of fire on mouse up
canvas.addEventListener('mouseup', () => {
  fireSound.pause();
  fireSound.currentTime = 0;
});




//======================================
// Animation function << Moving things
//======================================
function animate() {
  if (gameStarted) { // infinite loop 
    frameNumber = requestAnimationFrame(animate);
  }
  if(enemyKilled){
    c.fillStyle = 'rgba(134, 42, 19, 0.5)' // opacity 0.2 to get tail effect
    enemyKilled = false;
  }else{
    c.fillStyle = 'rgba(0,0,0,0.2)' // opacity 0.2 to get tail effect
  }
  c.fillRect(0, 0, canvas.width, canvas.height); // new canvas fill every frame 
  player.draw();
  // loop throught the projectile
  allProjectiles.forEach((proj) => {
    proj.update();
  });

  // loop throught the particales
  allParticales.forEach((part, index) => {
    if (part.alpha <= 0) {
      allParticales.splice(index, 1);
    } else {
      part.update();
    }
  });

  // Remove projectiles that out of our view
  allProjectiles.forEach((proj, projIndex) => {
    if (proj.x < 0 || proj.y < 0 || proj.x > canvas.width || proj.y > canvas.height) {
      setTimeout(() => {
        allProjectiles.splice(projIndex, 1); // remove the projectile
      }, 0);
    }
  });

  // draw all Enemies
  allEnemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    // destory enemy when projectile touch it
    allProjectiles.forEach((proj, projIndex) => {
      let projAndEnemyDistance = Math.hypot(enemy.x - proj.x, enemy.y - proj.y); // get the distance between current enemy and all projectiles

      if (projAndEnemyDistance - enemy.radius - proj.radius < 1) { // if they touched

        if (enemy.radius - 10 > hitPower) { // if enemy radius greater than the hit power 
          allEnemies[enemyIndex].radius = enemy.radius - hitPower; // reduce the radius

          // Shrink into particales
          for (let i = 0; i < enemy.radius; i++) {
            CreateRandomParticle(proj.x, proj.y, enemy.color);
          }

          score += hitPower; // increase score
        }
        else {
          setTimeout(() => { // to get ride of flash effect on killing enemy
            allEnemies.splice(enemyIndex, 1); // remove the enemy
          }, 0);

          // Shrink into particales
          for (let i = 0; i < enemy.radius * 2; i++) {
            CreateRandomParticle(proj.x, proj.y, enemy.color);
          }
          enemyKilled = true;
          score += hitPower * 2; // increase score

        }

        setTimeout(() => { // to get ride of flash effect on killing enemy
          allProjectiles.splice(projIndex, 1); // remove the projectile
        }, 0);

      }

    }); // allProjectiles.forEach((proj, projIndex)

    // End the game when enemy touch the player
    let playerAndEnemyDistance = Math.hypot(player.x - enemy.x, player.y - enemy.y); // get the distance between current enemy and player
    if (playerAndEnemyDistance - player.radius - enemy.radius < 1) { // if they touched
      gameOver();
    }
  }); // allEnemies.forEach((enemy, enemyIndex)

  // update score
  liveScore.innerHTML = "Score: " + score;
}

// create random enemies
function spawnEnemies() {
  enemyInterval = setInterval(function () {
    const radius = Math.random() * 25 + 10;
    let enemyX;
    let enemyY;
    if (Math.random() < 0.7) { // %70 chance coming from left and right 
      enemyX = Math.random() < 0.5 ? 0 - radius : canvas.width + radius; // to come from outside the canvas
      enemyY = Math.random() * canvas.height;
    } else { // %30 chance to come from top or buttom
      enemyX = Math.random() * canvas.width;
      enemyY = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = getRandomColor();
    const angle = Math.atan2(centery - enemyY, centerx - enemyX);
    velocity = {
      x: Math.cos(angle) * enemySpeed,
      y: Math.sin(angle) * enemySpeed
    }

    // create enemy if the tab is visible "not minimize or other tab opened" 
    if (document.visibilityState == 'visible' && gameStarted) {
      allEnemies.push(new Enemy(enemyX, enemyY, radius, color, velocity));
    }
  }, generateEnemyTime);
}


//==========================
// Functions
//==========================

//===============================
// START THE GAME
function startTheGame() {
  // change game setting depending on difficulty level
  if(difficultyLevelFlag == 'easy')
  {
    gameSetting(3000, 1.5);
  }
  else if(difficultyLevelFlag == 'normal')
  {
    gameSetting(2000, 2);
  }
  else if(difficultyLevelFlag == 'hard')
  {
    gameSetting(1000, 2.5);
  }
  clearEveryThing();
  gameStarted = true;
  liveScore.classList.remove("hidden");
  soundControlGame.classList.remove("hidden");
  pauseGameBtn.classList.remove("hidden");

  spawnEnemies(); // to create enemies
  requestAnimationFrame(animate);

  pauseMenuSound.pause();
  pauseMenuSound.currentTime = 0;
  clearTimeout(pauseMenuTimeOut);
  backgroudSound.play();

  pauseByESC();
  pauseOnLosingFocus();

}


//===============================
// Pause THE GAME function
function pauseTheGame() {
  gameStarted = false;
  // stop audio
  backgroudSound.pause();
  backgroudSound.currentTime = 0;
  pauseMenuTimeOut = setTimeout(() => {
    pauseMenuSound.play();
  }, 100);
}

//===============================
// Resume THE GAME
function resumeTheGame() {
  gameStarted = true;
  requestAnimationFrame(animate);
  pauseMenuSound.pause();
  pauseMenuSound.currentTime = 0;
  clearTimeout(pauseMenuTimeOut);
  backgroudSound.play();
}

//===============================
// End THE GAME function
function gameOver() {
  gameStarted = false;
  soundControlGame.classList.add("hidden");
  pauseGameBtn.classList.add("hidden");
  gameOverOptions.classList.remove("hidden");
  liveScore.classList.add("hidden");
  finalScore.innerHTML = "Your Score: " + score;
  clearInterval(enemyInterval); // clear interval so we can call spawnEnemies() that contain setInterval() on start game 
  clearInterval(browserFocusInterval);
  // stop audio
  backgroudSound.pause();
  backgroudSound.currentTime = 0;
  playerDieSound.play();
  pauseMenuTimeOut = setTimeout(() => {
    pauseMenuSound.play();
  }, 1500);

  // clear all things in canvas for new game
  allParticales = [];
  allEnemies = [];
  allProjectiles = [];
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (score > parseInt(localStorage.getItem("highestScore"))) {
    localStorage.setItem("highestScore", score);
  }
  getHighestScore();
  
  score = 0;
}

//===============================
//Unmute game music 
function soundsOn() {
  gamedMuted = false;
  backgroudSound.muted = false;
  fireSound.muted = false;
  pauseMenuSound.muted = false;
  playerDieSound.muted = false;

  soundControl.forEach((soundBtn) => {
    soundBtn.innerHTML = '<i class="fas fa-volume-up fa-lg"></i>'; // change sound icon
  });
}

//===============================
//Mute game music 
function soundsOff() {
  gamedMuted = true;
  backgroudSound.muted = true;
  fireSound.muted = true;
  pauseMenuSound.muted = true;
  playerDieSound.muted = true;

  soundControl.forEach((soundBtn) => {
    soundBtn.innerHTML = '<i class="fas fa-volume-mute fa-lg"></i>'; // change sound icon
  });
}

//===============================
// puase game by ESC button
function pauseByESC() {
  window.onkeydown = (event) => {
    if (event.key === 'Escape') {
      if (gameStarted) {
        pauseGameMenuElem.classList.remove("hidden"); // Show pause menu
        soundControlGame.classList.add("hidden"); // Hide sound icon 
        pauseGameBtn.classList.add("hidden"); // Hide pause icon
        pauseTheGame();
      } else {
        pauseGameMenuElem.classList.add("hidden"); // Hide pause menu 
        soundControlGame.classList.remove("hidden"); // Show sound icon
        pauseGameBtn.classList.remove("hidden"); // Show pause icon  
        resumeTheGame();
      }
    }
  };
}

//===============================
// pause the game if browser minimize || another tab opened
function pauseOnLosingFocus() {
  browserFocusInterval = setInterval(() => {
    if (document.visibilityState == 'hidden') {
      pauseGameMenuElem.classList.remove("hidden"); // Show pause menu
      soundControlGame.classList.add("hidden"); // Hide sound icon 
      pauseGameBtn.classList.add("hidden"); // Hide pause icon
      pauseTheGame();
    }
  }, 10);
}

//===============================
// Create Random Particle for hitting the enemy
function CreateRandomParticle(x, y, color) {
  velocityX = (Math.random() - 0.5) * (8 * Math.random());
  velocityY = (Math.random() - 0.5) * (8 * Math.random());
  radius = Math.random() * 3;
  allParticales.push(new Particale(x, y, radius, color, { x: velocityX, y: velocityY }))
}

//===============================
// Create projectile going to specific point 
function CreateProjectile(clickPosX, clickPosY){
  const angle = Math.atan2(clickPosY - centery, clickPosX - centerx);
  velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) *  projectileSpeed
  }
  allProjectiles.push(new Projectile(centerx, centery, 5, "white", velocity));
 
}

//===============================
// Get hifhest score from localstorage
function getHighestScore() {
  // Retrieve highest score
  highestScoreDivs.forEach((div) => {
    if (localStorage.getItem("highestScore")) {
      div.innerHTML = localStorage.getItem("highestScore");
    } else {
      div.innerHTML = 0;
    }
  });
}

//===============================
// Game setting
function gameSetting(generateEnemyTimeParam, enemySpeedParam){
  enemySpeed = enemySpeedParam
  generateEnemyTime = generateEnemyTimeParam;
}

//===============================
// Delete every thing in canvas and clear interval and timeout
function clearEveryThing(){
  clearInterval(enemyInterval);
  clearInterval(browserFocusInterval);
  clearTimeout(pauseMenuTimeOut);
  allEnemies = [];
  allParticales = [];
  allProjectiles = [];
  c.clearRect(0, 0, canvas.width, canvas.height);
}

//===============================
// Rondom Color function
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var colorStart = '3456789ABCDEF'; // to get light colors << not start with 0,1,2 >>
  var color = '#' + colorStart[Math.floor(Math.random() * 13)];

  for (var i = 0; i < 5; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//===============================
// Get all siblings elements
function getAllSiblings(elem) {

	// Setup siblings array and get the first sibling
	var siblings = [];
	var sibling = elem.parentNode.firstChild;

	// Loop through each sibling and push to the array
	while (sibling) {
		if (sibling.nodeType === 1 && sibling !== elem) {
			siblings.push(sibling);
		}
		sibling = sibling.nextSibling
	}

	return siblings;

};