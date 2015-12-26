function Vector2 (x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2.prototype.magnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2.prototype.magSquare = function () {
  return this.x * this.x + this.y * this.y;
};

Vector2.prototype.add = function (v) {
  return new Vector2(this.x + v.x, this.y + v.y);
};

Vector2.prototype.sub = function (v) {
  return new Vector2(this.x - v.x, this.y - v.y);
};

Vector2.prototype.mul = function (c) {
  return new Vector2(this.x * c, this.y * c);
};

Vector2.prototype.div = function (c) {
  return new Vector2(this.x / c, this.y / c);
};

Vector2.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vector2.prototype.normalize = function () {
  return this.div(this.magnitude());
};
