function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

function Box(x, y, w, h) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 10;
  this.h = h || 10;
  this.left = this.x;
  this.top = this.y;
  this.right = this.x+this.w;
  this.bottom = this.y+this.h;
}

function Circle(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 1;
}
// TODO: vv_min
let dist2 = (a,b) => len2(vv_sub(a,b))
let dist = (a,b) => len(vv_sub(a,b))
let vs_mul = (v,a) => new Vector(v.x*a, v.y*a)
let vs_div = (v,a) => a != 0 ? new Vector(v.x/a, v.y/a) : new Vector(0, 0)
let vs_add = (v,a) => new Vector(v.x+a, v.y+a)
let vs_sub = (v,a) => new Vector(v.x-a, v.y-a)
let vv_add = (a,b) => new Vector(a.x+b.x, a.y+b.y)
let vv_sub = (a,b) => new Vector(a.x-b.x, a.y-b.y)
let dot = (a,b) => a.x*b.x + a.y*b.y
let len2 = v => dot(v, v)
let len = v => Math.sqrt(dot(v, v))
let normalize = v => vs_div(v, len(v, v))
let angle = v => Math.atan2(v.y, v.x)
let vec_from_angle = a => new Vector(Math.cos(a), Math.sin(a))
let center = b => new Vector(b.w/2+b.x, b.h/2+b.y)
let round = (a, p) => Math.round(a * 10**p) / 10**p
let trunc = (a, p) => Math.trunc(a * 10**p) / 10**p
let rand = (min, max) => Math.random() * (max-min) + min;

/* ------------- COLLISION ---------------- */

// TODO FIX
function col_aabb_circle(c, b) {
  var bc = box_center(b);
  var d = dist(c, bc);
  var or = Math.sqrt(b.w/2*b.w/2 + b.h/2*b.h/2);
  if (d > or + c.r) return false;
  var ir = b.w > b.h ? b.h / 2 : b.w / 2;
  if (d < ir + c.r) return true;
  var sp = sub_points(c, bc);
  // var vec = normalize(sp);
  var vec = {x: sp.x/mag(sp), y: sp.y/mag(sp) };
  var op = { x: vec.x * c.r, y: vec.y * c.r }
  op = add_points(c, op);
  return collision_point_box(op, b);
}

function col_aabb_aabb(a, b) {
  var r = aabb_left(a)   > aabb_right(b);
  var l = aabb_right(a)  < aabb_left(b);
  var t = aabb_bottom(a) < aabb_top(b)
  var b = aabb_top(a)    > aabb_bottom(b);
  return !(r|| l || t || b);
}

function col_point_box(p, b) {
  return !(p.x < aabb_left(b) || 
           p.x > aabb_right(b) || 
           p.y < aabb_top(b) || 
           p.y > aabb_bottom(b));
}

function col_point_circle(p, c) { 
  return dist2(c, p) <= c.r * c.r;
}





function math_test() {
  let v1 = new Vector(4, 3);
  let v2 = new Vector(1, 2);

  console.log(v1, v2);
  console.log(v1, "len", len(v1,v2), "len2", len2(v1,v2));
  console.log(v1, "normalized", normalize(v1));
  console.log(v2, "angle", angle(v2));
  console.log("vec from-to", vv_sub(v1, v2));
  console.log("dist", dist(v1,v2), "dist2", dist2(v1,v2));
  console.log("dot", dot(v1, v2));

  let b = new Box(10, 15, 40, 60);
  console.log(b, "center", center(b));
}