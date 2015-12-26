function Hash2d(width, height, cellSize) {

/*
  var widthCell = width/cellSize + 2;
  var heightCell = height/cellSize + 2;
  this.hash = [];
  for (var i=0; i<widthCell; i+=1) {
    this.hash.push([]);
    for (var j=0; j<heightCell; j+=1) {
      this.hash[i].push([]);
    }
  }
  */

  this.hash = [];
  this.cellSize = cellSize;
}

Hash2d.prototype.clear = function () {
  /*
  var widthCell = this.hash.length;
  var heightCell = this.hash[0] !== undefined ? 0 : this.hash[0].length;

  for (var i=0; i<widthCell; i+=1) {
    for (var j=0; j<heightCell; j+=1) {
      this.hash[i][j] = [];
    }
  }
  */

  this.hash = [];
};

Hash2d.prototype.put = function (x, y, obj) {
  /*
  var widthCell = this.hash.length,
      heightCell = this.hash[0] !== undefined ? 0 : this.hash[0].length;
  var cellX = parseInt(x / this.cellSize),
      cellY = parseInt(y / this.cellSize);

  for (var i=0; i<widthCell; i+=1) {
    for (var j=0; j<heightCell; j+=1) {
      var index = this.hash[i][j].indexOf(obj);
      if (index !== -1) {
        if (cellX !== i || cellY !== j) {
          this.hash[cellX][cellY].push(this.hash[i][j].splice(index, 1));
        }

        return;
      }
    }
  }

  this.hash[cellX][cellY].push(obj);
  */

  this.hash.push(obj);
};

Hash2d.prototype.get = function (x, y, h) {
  /*
  var cellX = parseInt(x / this.cellSize),
      cellY = parseInt(y / this.cellSize);

  return this.hash[cellX][cellY];
  */

  var size = this.hash.length;
  var neighbors = [];

  for (var i=0; i<size; i+=1) {
    if (this.hash[i].p.sub(new Vector2(x, y)).magnitude() < h) {
      neighbors.push(this.hash[i]);
    }
  }

  return neighbors;
};

Hash2d.prototype.all = function () {
  // return [].concat.apply([], [].concat.apply([], this.hash));
  return this.hash;
};
