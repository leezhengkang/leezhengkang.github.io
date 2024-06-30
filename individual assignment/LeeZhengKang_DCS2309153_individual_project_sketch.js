let player;
let enemies = [];
let rangedEnemies = [];
let rocks = [];
let dirt = [];
let cols, rows;
let cellSize = 20;
let gameOver = false;
let projectiles = [];
let enemyBullets = [];
let score = 0;
let attacking = false;
let logo;
let bgmplay=false;

function preload(){
  avatarImage = loadImage('digdug-removebg-preview.png');
  monster1Image = loadImage('digdugmonster1.png');
  monster2Image = loadImage('digdugmonster2-removebg-preview.png');
  rockImage = loadImage('Dig_Dug_rock.png');
  img = loadImage("crescendo-oglogo.png");
  
}

function setup() {
  createCanvas(800, 600);
  cols = width / cellSize;
  rows = height / cellSize;
  initializeDirt();
  initializeRocks();
  player = new Player();
  initializeEnemies();
  
}

function draw() {
  if (gameOver) {
    displayGameOver();
   
    
    
    return;
  }

  if (enemies.length === 0 && rangedEnemies.length === 0) {
    displayWin();
    return;
  }
  
  

  background(200, 150, 100); // Base dirt color
  displayDirt();
  player.move();
  player.display();
  displayRocks();
  displayProjectiles();
  displayEnemies();
  displayRangedEnemies();
  displayBullets();

  if (attacking) {
    player.attack();
  }

  checkCollisions();
  displayScore();
}



function initializeDirt() {
  for (let i = 0; i < cols; i++) {
    dirt[i] = [];
    for (let j = 0; j < rows; j++) {
      dirt[i][j] = true; // True means dirt is present
    }
  }
}

function initializeRocks() {
  rocks = [];
  while (rocks.length < 10) {
    let newRock = new Rock(random(width), random(height));
    if (!isRockTooClose(newRock)) {
      rocks.push(newRock);
    }
  }
}

function isRockTooClose(newRock) {
  for (let rock of rocks) {
    if (dist(newRock.x, newRock.y, rock.x, rock.y) < newRock.size * 2) {
      return true;
    }
  }
  return false;
}

function initializeEnemies() {
  enemies = [];
  rangedEnemies = [];
  let totalEnemies = floor(random(3, 6)); // Random number between 3 and 5
  let totalRangedEnemies = floor(random(1, 3)); // Random number between 1 and 2

  for (let i = 0; i < totalEnemies; i++) {
    enemies.push(new Enemy(random(width), random(height / 2)));
  }
  for (let i = 0; i < totalRangedEnemies; i++) {
    rangedEnemies.push(new RangedEnemy(random(width), random(height / 2)));
  }
}

function displayGameOver() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Game Over", width / 2, height / 2);
}

function displayWin() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Win!", width / 2, height / 2);
}

function displayDirt() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (dirt[i][j]) {
        fill(139, 69, 19); // Brown color for dirt
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

function displayRocks() {
  for (let rock of rocks) {
    rock.display();
  }
}

function displayProjectiles() {
  for (let projectile of projectiles) {
    projectile.move();
    projectile.display();
    projectile.checkCollision(enemies);
    projectile.checkCollision(rangedEnemies);
  }
}

function displayEnemies() {
  for (let enemy of enemies) {
    enemy.moveTowards(player);
    enemy.display();
    if (enemyTouchesPlayer(enemy)) {
      gameOver = true;
    }
  }
}

function displayRangedEnemies() {
  for (let enemy of rangedEnemies) {
    enemy.moveTowards(player);
    enemy.display();
    enemy.shoot(player);
    if (enemyTouchesPlayer(enemy)) {
      gameOver = true;
    }
  }
}

function displayBullets() {
  for (let bullet of enemyBullets) {
    bullet.move();
    bullet.display();
    if (bulletHitsPlayer(bullet)) {
      gameOver = true;
    }
  }
}

function keyPressed() {
  if (key === 'a' || key === 'A' ) {
    player.setDir(-1, 0);
  } else if (key === 'd' || key === 'D') {
    player.setDir(1, 0);
  } else if (key === 'w' || key === 'W') {
    player.setDir(0, -1);
  } else if (key === 's' || key === 'S') {
    player.setDir(0, 1);
  } 
}

function mousePressed(){
   if (mouseButton === LEFT ) {
    attacking = true;
  }

}

function keyReleased() {
  if (key === 'w'||key === 'a'||key === 's'||key === 'd') {
    player.setDir(0, 0);
  } 
}

function mouseReleased(){
   if (mouseButton === LEFT) {
    attacking = false;
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 20;
    this.xdir = 0;
    this.ydir = 0;
    this.speed = 3; // Decreased player speed
    this.lastDir = createVector(0, -1); // Default direction is up
  }

  move() {
    let nextX = this.x + this.xdir * this.speed;
    let nextY = this.y + this.ydir * this.speed;

    // Check for collision with rocks
    if (!this.hitsRock(nextX, nextY)) {
      if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
        this.x = nextX;
        this.y = nextY;
        this.clearDirt();
        if (this.xdir !== 0 || this.ydir !== 0) {
          this.lastDir.set(this.xdir, this.ydir);
        }
      }
    }
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  clearDirt() {
    let col = floor(this.x / cellSize);
    let row = floor(this.y / cellSize);
    if (dirt[col][row]) {
      dirt[col][row] = false; // Clear the dirt at the player's position
      score += 100; // Increase score by 100 for each cleared dirt
    }
  }

  display() {
    fill(0, 0, 255);
    image(avatarImage, this.x, this.y, this.size + 4, this.size + 4);
  }

  attack() {
    if (frameCount % 15 === 0) { // Fire rate control
      projectiles.push(new WaterProjectile(this.x + this.size / 2, this.y + this.size / 2, this.lastDir.x, this.lastDir.y));
    }
  }

  hitsRock(x, y) {
    for (let rock of rocks) {
      if (dist(x, y, rock.x + rock.size / 2, rock.y + rock.size / 2) < this.size / 2 + rock.size / 2) {
        return true;
      }
    }
    return false;
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 1; // Decreased speed of the enemy
    this.xdir = random([-1, 1]);
    this.ydir = random([-1, 1]);
  }

  moveTowards(player) {
    let angle = atan2(player.y - this.y, player.x - this.x);
    let nextX = this.x + this.speed * cos(angle);
    let nextY = this.y + this.speed * sin(angle);

    if (nextX < 0 || nextX > width || nextY < 0 || nextY > height || this.hitsRock(nextX, nextY)) {
      this.xdir = -this.xdir;
      this.ydir = -this.ydir;
    } else {
      this.x = nextX;
      this.y = nextY;
    }
  }

  hitsRock(x, y) {
    for (let rock of rocks) {
      if (dist(x, y, rock.x + rock.size / 2, rock.y + rock.size / 2) < this.size / 2 + rock.size / 2) {
        return true;
      }
    }
    return false;
  }

  display() {
    image(monster1Image, this.x, this.y, this.size, this.size);
  }
}

class RangedEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.shootInterval = 2000; // Interval between shots in milliseconds (2 seconds)
    this.lastShootTime = 0;
    this.direction = createVector(0, 0);
  }

  moveTowards(player) {
    let angle = atan2(player.y - this.y, player.x - this.x);
    let nextX = this.x + this.speed * cos(angle);
    let nextY = this.y + this.speed * sin(angle);

    if (nextX < 0 || nextX > width || nextY < 0 || nextY > height || this.hitsRock(nextX, nextY)) {
      this.xdir = -this.xdir;
      this.ydir = -this.ydir;
    } else {
      this.x = nextX;
      this.y = nextY;
    }
  }

  shoot(player) {
    let currentTime = millis();
    if (currentTime - this.lastShootTime >= this.shootInterval) {
      let angle = atan2(player.y - this.y, player.x - this.x);
      this.direction = createVector(cos(angle), sin(angle));
      enemyBullets.push(new Bullet(this.x, this.y, this.direction.x, this.direction.y));
      this.lastShootTime = currentTime;
    }
  }

  display() {
    image(monster2Image, this.x, this.y, this.size, this.size);
  }
}

class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
  }

  display() {
    image(rockImage, this.x, this.y, this.size, this.size);
  }
}

class WaterProjectile {
  constructor(x, y, xdir, ydir) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = 5;
    this.xdir = xdir;
    this.ydir = ydir;
    this.travelDistance = 0;
    this.maxDistance = 4 * cellSize; // Maximum travel distance in pixels
  }

  move() {
    this.x += this.xdir * this.speed;
    this.y += this.ydir * this.speed;
    this.travelDistance += this.speed;
    if (this.travelDistance >= this.maxDistance) {
      projectiles.splice(projectiles.indexOf(this), 1);
    }
  }

  display() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, this.size);
  }

  checkCollision(targetArray) {
    for (let target of targetArray) {
      if (dist(this.x, this.y, target.x, target.y) < this.size / 2 + target.size / 2) {
        targetArray.splice(targetArray.indexOf(target), 1);
        projectiles.splice(projectiles.indexOf(this), 1);
        score += 500; // Increase score by 500 for each enemy hit
        break;
      }
    }
  }
}

class Bullet {
  constructor(x, y, xdir, ydir) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = 2; // Reduced speed of enemy bullet
    this.xdir = xdir;
    this.ydir = ydir;
  }

  move() {
    this.x += this.xdir * this.speed;
    this.y += this.ydir * this.speed;
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      enemyBullets.splice(enemyBullets.indexOf(this), 1);
    }
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
  }
}


function enemyTouchesPlayer(enemy) {
  return dist(player.x, player.y, enemy.x, enemy.y) < player.size / 2 + enemy.size / 2;
}

function bulletHitsPlayer(bullet) {
  return dist(player.x, player.y, bullet.x, bullet.y) < player.size / 2 + bullet.size / 2;
}

function checkCollisions() {
  // Check for collisions between projectiles and enemies
  for (let projectile of projectiles) {
    projectile.checkCollision(enemies);
    projectile.checkCollision(rangedEnemies);
  }

  // Check for collisions between enemy bullets and player
  for (let bullet of enemyBullets) {
    if (bulletHitsPlayer(bullet)) {
      gameOver = true;
    }
  }
  image(img, 132, 61, 180, 100);
}

function displayScore() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
}

