const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

//star class
class Star {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gravity = 0.7;
    this.friction = 0.7;
    this.velocity = {
      x: Math.random() - 0.5 * 8,
      y: 3,
    };
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  shatter() {
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
      miniStars.push(new MiniStar(this.x, this.y, 2));
    }
  }
  update() {
    this.draw();

    //When star hits the ground
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y * this.friction;
      this.shatter();
    } else {
      this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    //When star hits a wall
    if (
      this.x + this.radius + this.velocity.x > canvas.width ||
      this.x - this.radius <= 0
    ) {
      this.velocity.x = -this.velocity.x * this.friction;
      this.shatter();
    }
  }
}

//mini stars class

class MiniStar extends Star {
  constructor(x, y, radius, color) {
    super(x, y, radius, color);
    this.gravity = 0.2;
    this.friction = 1;
    this.velocity = {
      x: randomIntFromRange(-5, 5),
      y: randomIntFromRange(-15, 15),
    };
    this.ttl = 200;
    this.opacity = 1;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(227,234,239,${this.opacity})`;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.draw();
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y * this.friction;
    } else {
      this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl;
  }
}

function createMountain(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = canvas.width / mountainAmount;
    ctx.beginPath();
    ctx.moveTo(i * mountainWidth, canvas.height);
    ctx.lineTo(i * mountainWidth + mountainWidth + 625, canvas.height);
    ctx.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    ctx.lineTo(i * mountainWidth - 625, canvas.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}

//Implemetation
const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
bgGradient.addColorStop(0, '#171E26');
bgGradient.addColorStop(1, '#3F586B');

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let rndSpawn = 75;
let groundHeight = 100;

function init() {
  stars = [];
  miniStars = [];
  backgroundStars = [];

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStars.push(new Star(x, y, radius, 'white'));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach((star) => {
    star.draw();
  });

  createMountain(1, canvas.height - 150, '#384551');
  createMountain(2, canvas.height - 250, '#2B3843');
  createMountain(3, canvas.height - 500, '#26333E');

  ctx.fillStyle = '#182028';
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  stars.forEach((star, i) => {
    star.update();
    if (star.radius <= 0) {
      stars.splice(i, 1);
    }
  });

  miniStars.forEach((miniStar, i) => {
    miniStar.update();
    if (miniStar.ttl === 0) {
      miniStars.splice(i, 1);
    }
  });

  ticker++;

  if (ticker % rndSpawn === 0) {
    const radius = 12;
    const x = Math.max(radius, Math.random() * canvas.width - radius);
    stars.push(new Star(x, -100, radius, 'white'));
    rndSpawn = randomIntFromRange(150, 300);
  }
}

//util functions

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

init();
animate();
