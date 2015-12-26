function getSimulation() {
  var canvas;
  var fps = 60;

  var width = 4;
  var height = 3;

  var dt = 1 / 100;
  var restDensity = 400;
  var k = 0.08;
  var kNear = 0.1;
  var beta = 2;
  var omega = 1;
  var h = 0.1;
  var gravity = new Vector2(0, 9.8);

  var simulation;
  var particles = new Hash2d(width, height, 2 * h);
  var particleNumber = 0;

  function createParticles(number) {
    var x, y;

    for (var i=width * 1/5; i<width * 2/5; i+=h/3) {
      for (var j=height * 1/6; j<height * 5/5; j+=h/2) {
        particles.put(i, j, new Particle(new Vector2(i, j)));
        particleNumber += 1;
      }
    }
  }

  function drawParticles() {
    var allParticles = particles.all();

    canvas.clear();
    for (var i=0; i<particleNumber; i+=1) {
      canvas.drawCircle(allParticles[i].p, 2);
    }
  }

  function applyGravity() {
    /*
      1. foreach particle i
      2.    // apply gravity
      3.    v_i ← v_i + ∆t * g
    */

    var allParticles = particles.all();

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];

      particle.v = particle.v.add(gravity.mul(dt));
    }
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

    var allParticles = particles.all();
    var particle, neighbors, neighborsNumber;
    var r, q, u, I;

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];
      neighbors = particles.get(particle.p.x, particle.p.y, h);
      neighborsNumber = neighbors.length;

      particle.relaxedP = new Vector2();
      for (var j=0; j<neighborsNumber; j+=1) {
        neighbor = neighbors[j];

        r = neighbor.p.sub(particle.p);
        q = r.magnitude() / h;

        if (q < 1) {
          u = particle.v.sub(neighbor.v).dot(r.normalize());

          if (u > 0) {
            I = r.normalize().mul(dt * (1 - q) * (omega * u + beta * u * u));

            particle.v = particle.v.sub(I.div(2));
            neighbor.v = neighbor.v.add(I.div(2));
          }
        }
      }
    }
	}

  function advancePosition() {
    /*
      6. foreach particle i
      7.    // save previous position
      8.    x^prev_i ← x_i
      9.    // advance to predicted position
      10.   x_i ← x_i + ∆t * v_i
    */

    var allParticles = particles.all();

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];

      particle.prevP = new Vector2(particle.p.x, particle.p.y);
      particle.p = particle.p.add(particle.v.mul(dt));
    }
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

    var allParticles = particles.all();
    var particle, neighbors, neighborsNumber;
    var r, q, d;

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];
      neighbors = particles.get(particle.p.x, particle.p.y,h);
      neighborsNumber = neighbors.length;

      for (var j=0; j<neighborsNumber; j+=1) {
        neighbor = neighbors[j];

        r = neighbor.p.sub(particle.p);
        q = r.magnitude() / h;

        if (q < 1) {
          ;
        }
      }
    }
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
      8.            ρ ← ρ + (1−q)^2
      9.            ρ^near ← ρ^near + (1−q)^3
      10.   // compute pressure and near-pressure
      11.   P ← k(ρ−ρ0)
      12.   P^near ← k^near * ρ^near
      13.   dx ← 0
      14.   foreach particle j ∈ neighbors( i )
      15.       q ← r_ij / h
      16.       if q < 1
      17.           // apply displacements
      18.           D ← ∆t^2 * (P * (1−q) + P^near * (1−q)^2) * rˆ_ij
      19.           x_j ← x_j + D/2
      20.           dx ← dx − D/2
      21.   x_i ← x_i +dx
    */

    var allParticles = particles.all();
    var particle, neighbors, neighborsNumber;
    var density, nearDensity;
    var r, q;
    var pressure, nearPressure, dx;
    var D;

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];
      neighbors = particles.get(particle.p.x, particle.p.y, h);
      neighborsNumber = neighbors.length;

      density = 0;
      nearDensity = 0;

      for (var j=0; j<neighborsNumber; j+=1) {
        neighbor = neighbors[j];

        r = neighbor.p.sub(particle.p);
        q = r.magnitude() / h;

        if (q < 1) {
          density += (1 - q) * (1 - q) * 20 / (2 * Math.PI * h * h);
          nearDensity += (1 - q) * (1 - q) * (1 - q) * 30 / (2 * Math.PI * h * h);
        }
      }

      pressure = k * (density - restDensity);
      nearPressure = kNear * nearDensity;
      dx = new Vector2();

      for (var j=0; j<neighborsNumber; j+=1) {
        neighbor = neighbors[j];

        r = neighbor.p.sub(particle.p);
        q = r.magnitude() / h;

        if (q < 1) {
          D = r.normalize().mul(dt * dt * (pressure * (1 - q) + nearPressure * (1 - q) * (1 - q)));

          neighbor.p = neighbor.p.add(D.div(2));
          dx = dx.sub(D.div(2));
        }
      }

      particle.p = particle.p.add(dx);
    }
	}

  function resolveCollisions() {
    var allParticles = particles.all();

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];

      if (particle.p.x < 0) {
        particle.p.x = 0;
      }

      if (particle.p.y < 0) {
        particle.p.y = 0;
      }

      if (particle.p.x > width) {
        particle.p.x = width;
      }

      if (particle.p.y > height) {
        particle.p.y = height;
      }
    }
	}

  function recalculateVelocity() {
    /*
      18. foreach particle i
      19.   // use previous position to compute next velocity
      20.   v_i ← (x_i − x^prev_i) / ∆t
    */

    var allParticles = particles.all();

    for (var i=0; i<particleNumber; i+=1) {
      particle = allParticles[i];

      particle.v = particle.p.sub(particle.prevP).div(dt);
    }
	}

  return {
    init: function () {
      canvas = getCanvas(width, height);

      createParticles(1);
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

        drawParticles();

        applyGravity();
        applyViscosity();
        advancePosition();
        adjustSprings();
        applySpringDisplacements();
        doubleDensityRelaxation();
        resolveCollisions();
        recalculateVelocity();
      }, 1000 / fps);
    },
    pause: function () {
      simulation();
    }
  };
}
