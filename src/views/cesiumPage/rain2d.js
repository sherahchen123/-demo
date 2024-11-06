var data = 150
var str = ""
for (let i = 0; i < data; i++) {
  str += '<div class="rainchild"></div>'
}

var maxParticles = 100000
var particles = []
var particleSize = 3
var emissionRate = 1
var ballFriction = 0.99
var collisionDamper = 0.1
var lastPos = null
var objectSize = 3
var rainSize = 1.8
var canvas = null
var ctx = null

export function addRain() {
  let animationFrame;
  let running = true;

  setTimeout(() => {
    canvas = document.getElementById("rainCanvas");
    ctx = canvas.getContext("2d");

    const lightning1Interval = setInterval(() => {
      var picture1 = document.getElementsByClassName("lightning1")[0];
      picture1.style.setProperty("left", `${Math.random() * 100}%`, "important");
    }, 5700);

    const lightning2Interval = setInterval(() => {
      var picture1 = document.getElementsByClassName("lightning2")[0];
      picture1.style.setProperty("left", `${Math.random() * 100}%`, "important");
    }, 5400);

    function loop() {
      if (!running) return;
      
      clear();
      update();
      draw(ctx);
      animationFrame = requestAnimationFrame(loop);
    }

    loop();

    // Return control object
    return {
      stop: () => {
        running = false;
        cancelAnimationFrame(animationFrame);
        clearInterval(lightning1Interval);
        clearInterval(lightning2Interval);
      }
    };
  }, 3000);
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function update() {
  if (particles.length < maxParticles) {
    for (let j = 0; j < 30; j++) {
      const curPart = particle()
      particles.push(curPart)
    }
  }
  updateParticles()
}
function draw() {
  drawParticles();
}
function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    const position = particles[i].position;
    var gnt = ctx.createLinearGradient(position.x, position.y, position.x + particles[i].length / 5, position.y + particles[i].length);
    gnt.addColorStop(0, "rgb(255,255,255,0)");
    gnt.addColorStop(0.4, `rgb(255,255,255,${0.3 + (Math.random() - 0.5) / 10})`);
    gnt.addColorStop(1, `rgb(255,255,255,${0.5 + (Math.random() - 0.5) / 10})`);
    ctx.fillStyle = gnt;
    ctx.strokeStyle = gnt;
    ctx.lineWidth = particles[i].lineWidth;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + particles[i].length / 5, position.y + particles[i].length);
    ctx.stroke();
  }
}
function particle() {
  let y = 1 - (Math.random() * 10) / 3;
  const particle = {
    position: {
      x: 40 + Math.random() * (canvas.width - 40),
      y: -(Math.random() * 50),
      z: Math.random() * 10
    },
    velocity: {
      x: 0,
      y: 0
    },
    radius: particleSize,
    mass: particleSize,
    alpha: 0.35 + Math.random() * 0.25,
    length: 2 + Math.random() * 2.5,
    lineWidth: 1 - (Math.random() * 14) / 12,
    acceleration: {
      x: y / 5 + (Math.random() - 0.5) / 50,
      y: y
    }
  };
  return particle;
}
function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].velocity.x =
      particles[i].velocity.x + particles[i].acceleration.x;
    particles[i].velocity.y =
      particles[i].velocity.y + particles[i].acceleration.y;
    particles[i].position.x =
      particles[i].position.x + particles[i].velocity.x;
    particles[i].position.y =
      particles[i].position.y + particles[i].velocity.y;
    checkNextBoundaries(i, particles[i].position.y);
    if (particles[i]) {
      particles[i].length =
        particles[i].velocity.y * rainSize;
      const nextVy =
        particles[i].velocity.y + particles[i].acceleration.y;
      const nextPy =
        particles[i].position.y + particles[i].velocity.y;
      // loopcheckNextBoundaries(i, nextPy);
    }
  }
}
function checkNextBoundaries(i, nextPy) {
  if (
    nextPy >=
    canvas.height * 0.9 -
      particles[i].position.z * 55 -
      particles[i].radius
  ) {
    particles[i].velocity.y *= -1;
    particles[i].velocity.y *= collisionDamper;
    particles[i].length = 3;
    if (
      particles[i].velocity.y >= -0.2 &&
      particles[i].velocity.y <= 0.2
    ) {
      particles[i].acceleration.y = 0;
      particles[i].velocity.y = 0;
      particles.splice(i, 1);
    }
  }
}