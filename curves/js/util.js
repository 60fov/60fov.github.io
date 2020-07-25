function randmm(min, max) {
  return min + Math.random() * (max - min);
}

function diff(x, y) {
  return Math.abs(x - y);
}

function dist2(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function vec2(x, y) {
  return new THREE.Vector2(x, y);
}

function vec3(x, y) {
  return new THREE.Vector3(x, y);
}

function lerp2(v1, v2, a) {
  return vec2(v1.x + (v2.x - v1.x) * a, v1.y + (v2.y - v1.y) * a);
}