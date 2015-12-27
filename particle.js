function Particle (p, v) {
  this.p = p || new Vector2();
  this.v = v || new Vector2();
  this.spring = undefined;
}
