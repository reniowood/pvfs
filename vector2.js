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
  this.x += v.x;
  this.y += v.y;

  return this;
};

Vector2.prototype.sub = function (v) {
  this.x -= v.x;
  this.y -= v.y;

  return this;
};

Vector2.prototype.mul = function (c) {
  this.x *= c;
  this.y *= c;

  return this;
};

Vector2.prototype.div = function (c) {
  this.x /= c;
  this.y /= c;

  return this;
};

Vector2.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vector2.prototype.normVector = function () {
  return this.div(this.magnitude());
};
