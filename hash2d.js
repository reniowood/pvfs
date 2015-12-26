function Hash2d(width, height, cellSize) {
  var widthCell = width/cellSize;
  var heightCell = height/cellSize;

  this.hash = [];
  for (var i=0; i<widthCell; i+=1) {
    this.hash.push([]);
    for (var j=0; j<heightCell; j+=1) {
      this.hash[i].push([]);
    }
  }

  this.cellSize = cellSize;
}

Hash2d.prototype.clear = function () {
  var widthCell = this.hash.length;
  var heightCell = this.hash[0] !== undefined ? 0 : this.hash[0].length;

  for (var i=0; i<widthCell; i+=1) {
    for (var j=0; j<heightCell; j+=1) {
      this.hash[i][j] = [];
    }
  }
};

Hash2d.prototype.put = function (x, y, obj) {
  var widthCell = this.hash.length,
      heightCell = this.hash[0] !== undefined ? 0 : this.hash[0].length;
  var cellX = parseInt(x / this.cellSize),
      cellY = parseInt(y % this.cellSize);

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
};

Hash2d.prototype.get = function (x, y) {
  return this.hash[x % this.cellSize][y % this.cellSize];
};

Hash2d.prototype.all = function () {
  return [].concat.apply([], [].concat.apply([], this.hash));
};
