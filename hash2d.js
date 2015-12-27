function getSpatialHash(cellSize) {
  var hashTable = {
    table: {},
    push: function (hash, particle) {
      if (this.table.hasOwnProperty(hash)) {
        this.table[hash].push(particle);
      } else {
        this.table[hash] = [particle];
      }
    },
    get: function (hash) {
      return this.table[hash];
    },
    traverse: function (callback) {
      for (var hash in this.table) {
        if (this.table.hasOwnProperty(hash)) {
          this.table[hash].forEach(function (particle) {
            callback(particle);
          });
        }
      }
    },
    rehash: function () {
      var particles = [];

      this.traverse(function (particle) {
        particles.push(particle);
      });

      this.table = {};

      var self = this;
      particles.forEach(function (particle) {
        self.push(getHash(getCellIndex(particle.p)), particle);
      });
    }
  };

  var p1 = 73856093,
      p2 = 19349663,
      M = 0;
  var x_min = 12345678, y_min = 12345678;

  function createHash(particles) {
    M = particles.length;

    particles.forEach(function (particle) {
      if (particle.p.x < x_min) {
        x_min = particle.p.x;
      }
      if (particle.p.y < y_min) {
        y_min = particle.p.y;
      }
    });

    particles.forEach(function (particle) {
      hashTable.push(getHash(getCellIndex(particle.p)), particle);
    });
  }

  function getCellIndex(p) {
    return new Vector2(Math.floor((p.x - x_min) / cellSize), Math.floor((p.y - y_min) / cellSize));
  }

  function getHash(i) {
    return (i.x * p1 ^ i.y * p2) % M;
  }

  return {
    init: function (particles) {
      createHash(particles);
    },
    getNeighbors: function (particle, h) {
      var neighbors = [];
      var cellIndex = getCellIndex(particle.p);
      var candidates = [];

      for (var i=-1; i<=1; i+=1) {
        for (var j=-1; j<=1; j+=1) {
          candidates = hashTable.get(getHash(cellIndex.add(new Vector2(i, j))));

          if (candidates !== undefined) {
            neighbors = neighbors.concat(candidates.filter(function (candidate) {
              return particle.p.sub(candidate.p).magnitude() < h;
            }));
          }
        }
      }

      return neighbors;
    },
    traverse: function (callback) {
      hashTable.traverse(callback);
    },
    rehash: function () {
      hashTable.rehash();
    }
  };
}
