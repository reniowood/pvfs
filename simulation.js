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

  function applyGravity() {
    /*
      1. foreach particle i
      2.    // apply gravity
      3.    v_i ← v_i + ∆t * g
    */
	}

  function applyViscosity() {
    /*
      1. foreach neighbor pair i j, (i < j)
      2.    q ← r_ij / h
      3.    if q < 1
      4.        // inward radial velocity
      5.        u ← (v_i − v_j) * rˆ_ij
      6.        if u > 0
      7.        // linear and quadratic impulses
      8.        I ← ∆t * (1 − q) * (σ * u + β * u^2) * rˆ_ij
      9.        v_i ← v_i − I / 2
      10.       v_j ← v_j + I / 2
    */
	}

  function advancePosition() {
    /*
      6. foreach particle i
      7.    // save previous position
      8.    x^prev_i ← x_i
      9.    // advance to predicted position
      10.   x_i ← x_i + ∆t * v_i
    */
	}

  function adjustSprings() {
    /*
      1. foreach neighbor pair i j, (i < j)
      2.    q ← r_ij/h
      3.    if q < 1
      4.      if there is no spring i j
      5.          add spring i j with rest length h
      6.      // tolerable deformation = yield ratio * rest length
      7.      d ← γ * L_ij
      8.      if r_ij > L + d // stretch
      9.        L_ij ← L_ij + ∆t * α * (r_ij − L − d)
      10.     else if r_ij < L − d // compress
      11.       L_ij ← L_ij − ∆t * α * (L − d − r_ij)
      12. foreach spring i j
      13.   if L_ij > h
      14.     remove spring i j
    */
	}

  function applySpringDisplacements() {
    /*
      1. foreach spring i j
      2.  D ← ∆t^2 * k^spring * (1 − L_ij/h)(L_ij − r_ij) * rˆ_ij
      3.  x_i ← x_i − D/2
      4.  x_j ← x_j + D/2
    */
	}

  function doubleDensityRelaxation() {
    /*
      1. foreach particle i
      2.    ρ ← 0
      3.    ρ^near ← 0
      4.    // compute density and near-density
      5.    foreach particle j ∈ neighbors( i )
      6.        q ← r_ij / h
      7.        if q < 1
      8.        ρ ← ρ + (1−q)^2
      9.        ρ^near ← ρ^near + (1−q)^3
      10.   // compute pressure and near-pressure
      11.   P ← k(ρ−ρ0)
      12.   P^near ← k^near * ρ^near
      13.   dx ← 0
      14.   foreach particle j ∈ neighbors( i )
      15.   q ← r_ij / h
      16.   if q < 1
      17.     // apply displacements
      18.     D ← ∆t^2 * (P * (1−q) + P^near * (1−q)^2) * rˆ_ij
      19.     x_j ← x_j + D/2
      20.     dx ← dx − D/2
      21.   x_i ← x_i +dx
    */
	}

  function resolveCollisions() {
	}

  function recalculateVelocity() {
    /*
      18. foreach particle i
      19.   // use previous position to compute next velocity
      20.   vi ← (x_i − x^prev_i)/∆t
    */
	}

  return {
    init: function () {
      canvas = getCanvas(width, height);

      createParticles(1000);
    },
    start: function () {
      simulation = setInterval(function () {
        /*
          1. foreach particle i
          2.    // apply gravity
          3.    v_i ← v_i + ∆t * g
          4. // modify velocities with pairwise viscosity impulses
          5. applyViscosity             // (Section 5.3)
          6. foreach particle i
          7.    // save previous position
          8.    x^prev_i ← x_i
          9.    // advance to predicted position
          10.   x_i ← x_i + ∆t * v_i
          11. // add and remove springs, change rest lengths
          12. adjustSprings             // (Section 5.2)
          13. // modify positions according to springs,
          14. // double density relaxation, and collisions
          15. applySpringDisplacements  // (Section 5.1)
          16. doubleDensityRelaxation   // (Section 4)
          17. resolveCollisions         // (Section 6)
          18. foreach particle i
          19.   // use previous position to compute next velocity
          20.   vi ← (x_i − x^prev_i)/∆t
        */

        applyGravity();
        applyViscosity();
        advancePosition();
        adjustSprings();
        applySpringDisplacements();
        doubleDensityRelaxation();
        resolveCollisions();
        recalculateVelocity();

        drawParticles();
      }, 1000 / this.fps);
    },
    pause: function () {
      simulation();
    }
  };
}
