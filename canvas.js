function Canvas() {
  return {
    context: document.getElementById('box').getContext('2d'),
    drawCircle: function (p, r) {
      this.context.beginPath();
      this.context.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.context.stroke();
    }
  }
}
