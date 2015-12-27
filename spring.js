function Spring(p1, p2, restLength, springs) {
  this.p1 = p1;
  this.p2 = p2;
  this.restLength = restLength;
  this.length = restLength;

  springs.push(this);
}
