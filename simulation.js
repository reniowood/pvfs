function getSimulation() {
  var canvas;
  var fps = 30;

  var width = 4;
  var height = 3;

  var dt = 1;
  var restDensity = 10;
  var k = 0.004;
  var kNear = 0.01;
  var kSpring = 0.3;
  var alpha = 0.3;
  var gamma = 0;
  var range = 0.1;

  var simulation;
  var particles = new Hash2d(width, height, range);
  var particlenumber = 0;

  function createParticles(number) {
    var x, y;

    for (var i=0; i<number; i+=1) {
      x = Math.random() * width;
      y = Math.random() * height;

      console.log(x, y);

      particles.put(x, y, new Particle(new Vector2(x, y)));
    }

    particleNumber = number;
  }

  function drawParticles() {
    var allParticles = particles.all();

    for (var i=0; i<particleNumber; i+=1) {
      canvas.drawCircle(allParticles[i].p, 10);
    }
  }

  return {
    init: function () {
      canvas = getCanvas(width, height);

      createParticles(1000);
    },
    start: function () {
      simulation = setInterval(function () {
        drawParticles();
      }, 1000 / this.fps);
    },
    pause: function () {
      simulation();
    }
  };
}
