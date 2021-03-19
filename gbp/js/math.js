let abs = a => Math.abs(a);
let trunc = a => Math.trunc(a);

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.neg = () => {this.x = -this.x; this.y = -this.y };
  this.len2 = () => this.dot(this);
  this.angle = () => Math.atan2(this.y, this.x);
  this.normalize = () => { let l = this.len(); this.x /= l; this.y /= l; };
  this.mul = s => { this.x *= s; this.y *= s };
  this.add = v => { this.x += v.x; this.y += v.y };
  this.sub = v => { this.x -= v.x; this.y -= v.y };
  this.dot = v => this.x * v.x + this.y * v.y;
  this.len = v => Math.sqrt(this.len2());
}

let vec_from_to = (a, b) => new Vector(b.x - a.x, b.y - a.y);