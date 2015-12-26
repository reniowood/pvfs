function getCanvas(boxWidth, boxHeight) {
  var canvas = document.getElementById('box');
  var context = canvas.getContext('2d');
  var ratio = {
    x: canvas.width / boxWidth,
    y: canvas.height/ boxHeight
  };

  return {
    drawCircle: function (p, r) {
      context.fillStyle = '#00f';
      context.beginPath();
      context.arc(p.x * ratio.x, p.y * ratio.y, r, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    },
    clear: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
