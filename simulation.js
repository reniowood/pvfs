function getSimulation() {
  var canvas;
  var fps = 30;

  var dt = 1;
  var restDensity = 10;
  var k = 0.004;
  var kNear = 0.01;
  var kSpring = 0.3;
  var alpha = 0.3;
  var gamma = 0;
  var range = 0.1;

  var simulation;
  var particles = [];

  function createParticles() {
  }

  return {
    init: function () {
      canvas = new Canvas();
      particles = createParticles();
    },
    start: function () {
      simulation = setInterval(function () {
        canvas.drawCircle(new Vector2(10, 10), 10);
      }, 1000 / this.fps);
    },
    pause: function () {
      simulation();
    }
  };
}
