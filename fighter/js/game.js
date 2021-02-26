var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = ctx.canvas.clientWidth;
var HEIGHT = ctx.canvas.clientHeight;
var TIME = 0;

var delta = 0, now = 0;

var cbr = canvas.getBoundingClientRect();
var BB = {x: 0, y: 0, w: WIDTH, h: HEIGHT};


var mouse = { x: -1, y: -1, btns: [0, 0, 0, 0, 0], in_game: true }
/* 
add keys from keybinding menu on page load
*/
var keys = { e: 0, s: 0, d: 0, f: 0 }

var debug_info = [];

var ghost_timer = 0;
var ghost_respawn_time = 1000;

var actions = { 
  "up": "w",
  "down": "s",
  "left": "a",
  "right": "d"
}

var input_state = {
  "up": 0,
  "justup": 1,
  "down": 2,
  "justdown": 3
}

var ground_ps = 8;
var ground_cache = [];

var sprites = {
  player: new Image(48, 48),
  ghost: new Image(48, 48),
  fireball: new Image(48, 48),
  reticle: new Image(48, 48)
}

var player = {
  x: 100, y: 100,
  w: 48, h: 48,
  speed: 200,
  health: 100,
  pd: 80
}

var game_state = "playing";
var score = 0;

var entities = [];

/* -------------- UPDATE ---------------- */

function game_over() {
  game_state = "over";
}


function game_reset() {
  entities = [];
  game_state = "playing";
  player = {
    x: 100, y: 100,
    w: 48, h: 48,
    speed: 200,
    health: 100,
    pd: 80
  }

  ghost_respawn_time = 1000;
}

function knock_back(owner, e, a) {
  var v = normalize(vec_to(owner, e));
  e.x += v.x * a;
  e.y += v.y * a;
}

function spawn_ghost(x, y) {
  var ghost = {};
  ghost.type = "ghost";
  ghost.x = x-24 || Math.random() * WIDTH;
  ghost.y = y-24 || Math.random() * HEIGHT;
  ghost.w = 48;
  ghost.h = 48;
  ghost.speed = 1;
  ghost.kill = false;

  entities.push(ghost);
}

function shoot_fireball(e) {
  var fb = {};
  fb.type = "fireball";

  fb.dir = normalize(vec_to(e, mouse));
  fb.speed = 10;
  fb.x = e.x + fb.dir.x * e.pd;
  fb.y = e.y + fb.dir.y * e.pd;
  fb.w = 48;
  fb.h = 48;
  fb.owner = e;
  fb.kill = false;

  entities.push(fb);
}

function update_fireball(fb) {
  fb.x += fb.dir.x * fb.speed;
  fb.y += fb.dir.y * fb.speed;
  if (!collision_aabb(fb, BB)) fb.kill = true;
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    if (entity == fb) {
      // console.log("skip");
      continue;
    }
    if (collision_aabb(entity, fb)) {
      // console.log(entity, fb);
      entities[i].kill = true;
      score += 1;

    }
    
  }
  // console.log(fb);
}

// phase in/out and teleport
function update_ghost(ghost) {
  ghost.y += Math.cos(TIME / 500) * 0.15;
  var d2 = dist2(player, ghost);
  if (d2 < Math.pow(150, 2)) {
    // TODO : normalize
    var dir = vec_to(ghost, player);
    ghost.x += dir.x * ghost.speed * delta / 1000;
    ghost.y += dir.y * ghost.speed * delta / 1000;
  }

  if (collision_aabb(player, ghost)) {
    player.health -= 20;
    knock_back(ghost, player, 70);
  }
}

function update_entities() {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    switch(entity.type) {
      case "ghost":
        update_ghost(entities[i]);
        break;
      case "fireball":
        update_fireball(entities[i]);
        break;
    }
  }

  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    if (entity.kill) entities.splice(i, 1);
  }

}


function update_player() {
  var v = {x: 0, y: 0}; 
  if (action("up")) v.y = -1;
  if (action("down")) v.y = 1;
  if (action("left")) v.x = -1;
  if (action("right")) v.x = 1;
  v = normalize(v);
  // console.log(v);
  v.x *= player.speed * delta / 1000;
  v.y *= player.speed * delta / 1000;
  player.x += v.x;
  player.y += v.y;
  // console.log(player.x, player.y);
}


function update() {
  // console.log("m1", mouse.btns[0]);
  // console.log("m3", m3());

  // console.log("back", action("back"));

  switch (game_state) {
    case "playing":
      update_player();
      update_entities();
  
      if (player.health <= 0) game_over();
  
      if (is_just_down(m2())) shoot_fireball(player);
      // if (is_just_up(m3())) spawn_ghost(mouse.x, mouse.y);
      if (ghost_timer <= 0) {
        ghost_timer = ghost_respawn_time;
        if (ghost_respawn_time > 100) ghost_respawn_time -= ghost_respawn_time / 1000 * 50;

        spawn_ghost();
      } else {
        ghost_timer -= delta;
      }
      break;
    case "over":      
      if (is_just_up(m1())) game_reset();
      break;

  }

  update_mouse();
  update_keys();
}

/* -------------- RENDER --------------- */

function draw_health() {
  var pc = box_center(player);
  ctx.beginPath()
  ctx.ellipse(pc.x, pc.y+20, 40, 20, 0, 0, Math.PI * 2 * (player.health / 100), false);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 10;
  ctx.stroke();
  // ctx.fillRect(player.x, player.y)
}

function draw_reticle() {
  var v = normalize(vec_to(player, mouse));
  var pc = box_center(player);
  draw_image(sprites.reticle, pc.x + v.x * player.pd - 12, pc.y + v.y * player.pd - 12, 24, 24);
}

function draw_fireball(fb) {
  // draw_circle({x: fb.x+24, y: fb.y+24, r:24, c: "white", fill: true})
  ctx.save();
  ctx.translate(fb.x+24, fb.y+24);
  ctx.rotate(angle(fb.dir)+Math.PI / 2);
  draw_image(sprites.fireball, -24, -24, 48, 48);
  ctx.restore();
}

function draw_ghost(ghost) {
  // draw_box({x: ghost.x, y: ghost.y, w: 48, h: 48, c: "white", fill: true});
  ctx.globalAlpha = 0.75;
  draw_image(sprites.ghost, ghost.x, ghost.y, 48, 48);
  ctx.globalAlpha = 1;
  // ctx.fillText("kill: " + ghost.kill, ghost.x, ghost.y);

}
 
function draw_player() {
  draw_image(sprites.player, player.x, player.y, 48, 48);
}

function draw_entities() {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    switch(entity.type) {
      case "ghost":
        draw_ghost(entities[i]);
        break;
      case "fireball":
        draw_fireball(entities[i]);
        break;
    }
  }
}

function draw_ground(ps, red, green, blue) {
  for (let y = 0; y < HEIGHT/ps; y++) {
    for (let x = 0; x < WIDTH/ps; x++) {

      var color = `rgb(${red}, ${green + (70*ground_cache[x+y*WIDTH/ps])}, ${blue})`;
      var b = {x: x * ps, y: y * ps, w: ps, h: ps, c: color, fill: true};
      draw_box(b);
    }
  }
}


function draw_box(b) {
  if (b.fill) {
    ctx.fillStyle = b.c;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
}

function draw_circle(c) {
  if (c.fill) {
    ctx.beginPath();
    ctx.fillStyle = c.c;
    ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}

function draw_vec(v) {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(v.x*100, v.y*100);
  ctx.stroke();
}

function draw_image(img, x, y, w, h) {
  ctx.drawImage(img, x, y, w, h);
}

function draw_debug_info() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  debug_info.forEach((line, i) => {
    ctx.fillText(line, 10, HEIGHT - (i * 20) - 10)
  });
}


function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  draw_ground(ground_ps, 32, 191, 85);
  draw_health();
  draw_player();
  draw_entities();
  draw_reticle();

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("score: " + score, 10, 30);

  switch (game_state) {
    case "over":
      ctx.font = "48px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      var text_data = ctx.measureText("Game Over");
      ctx.fillStyle = "white";
      ctx.fillText("Game Over",  (WIDTH - text_data.width) / 2, HEIGHT / 2);
  }

  draw_debug_info();
}

/* ------------- LOADING ---------------- */
function load_ground(ps) {
  for (let y = 0; y < HEIGHT/ps; y++) {
    for (let x = 0; x < WIDTH/ps; x++) {
      var z = perlin.get(x*2.1, y*2.1);   
      // var color = `rgb(${red}, ${green + (70*z)}, ${blue})`;
      ground_cache.push(z);
    }
  }
}


function load_sprites() {
  sprites.player.src = 'assets/hooded.png';
  sprites.ghost.src = 'assets/ghost.png';
  sprites.fireball.src = 'assets/fireball.png';
  sprites.reticle.src = 'assets/reticle.png';
}


/* ------------- COLLISION ---------------- */
function collision_aabb(a, b) {
  var r = aabb_left(a)   > aabb_right(b);
  var l = aabb_right(a)  < aabb_left(b);
  var t = aabb_bottom(a) < aabb_top(b)
  var b = aabb_top(a)    > aabb_bottom(b);
  return !(r|| l || t || b);
}

function collision_point_box(p, b) {
  return !(p.x < aabb_left(b) || p.x > aabb_right(b) || p.y < aabb_top(b) || p.y > aabb_bottom(b));
}

function collision_point_circle(p, c) { return dist2(c, p) <= c.r*c.r }


// TODO FIX
function collision_circle_aabb(c, b) {
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


/* ------------- MOUSE HANDLING ------------- */
function update_mouse() {
  for (let i = 0; i < mouse.btns.length; i++) {
    const btn = mouse.btns[i];
    if (is_just(btn)) mouse.btns[i]--;
  }
}

function handle_mouse_move(e) {
  // console.log(e);
  mouse.x = e.x - cbr.x;
  mouse.y = e.y - cbr.y;
  // console.log(mouse);
}

function handle_mouse_btn(e) {
  // console.log(e);
  e.preventDefault();
  if (e.type == "mousedown") {
    // possible redundant
    if (is_down(mouse.btns[e.button])) mouse.btns[e.button] = input_state["down"];
    else mouse.btns[e.button] = input_state["justdown"];
  } else {
    if (is_up(mouse.btns[e.button])) mouse.btns[e.button] = input_state["up"];
    else mouse.btns[e.button] = input_state["justup"];
  }
  // console.log(mouse.btns[0]);
}


/* ------------- KEY HANDLING ------------- */
function update_keys(e) {
  for (const key in keys) {
    const state = keys[key];
    if (is_just(state)) keys[key]--;
  }
}


function handle_keys(e) {
  // console.log(e.key);
  e.preventDefault();
  if (e.type == 'keydown') {
    if (is_down(keys[e.key])) keys[e.key] = input_state["down"];
    else keys[e.key] = input_state["justdown"];
  } else {
    if (is_up(keys[e.key])) keys[e.key] = input_state["up"];
    else keys[e.key] = input_state["justup"];
  }

}



/* ------------- HELPER FUNCTIONS ------------- */

function handle_context_menu(e) { e.preventDefault(); }
function is_down(input) { return input > 1; }
function is_up(input) { return !is_down(input); }
function is_just(input) { return input % 2 != 0; }
function is_just_up(input) {return input == input_state["justup"] }
function is_just_down(input) {return input == input_state["justdown"] }
function m_btn(i) { return mouse.btns[i]; }
function m1() { return m_btn(0); }
function m2() { return m_btn(2); }
function m3() { return m_btn(1); }
function m4() { return m_btn(3); }
function m5() { return m_btn(4); }
function action(a) { return keys[actions[a]]; }
function aabb_left(b) { return b.x }
function aabb_top(b) { return b.y }
function aabb_right(b) { return b.x + b.w }
function aabb_bottom(b) { return b.y + b.h }
function mag(v) { return Math.sqrt(v.x * v.x + v.y * v.y) }
function normalize(v) { var m = mag(v); if (m == 0) return v; else return { x: v.x / m,  y: v.y / m } }
function angle(v) { return Math.atan2(v.y, v.x) }
function dist(a, b) { return Math.sqrt(dist2(a, b)) }
function dist2(a, b) {return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) }
function box_center(b) { return {x: b.x + b.w/2, y: b.y + b.h/2} }
function circle_center(c) { return {x: c.x, y: c.y } }
function add_points(p1, p2) { return {x: p2.x + p1.x , y: p2.y + p1.y} }
function sub_points(p1, p2) { return {x: p2.x - p1.x , y: p2.y - p1.y} }
function vec_to(p1, p2) { return sub_points(p1, p2) }
function size_canvas() { /* TODO */ }


/* ------------ GAME LOOP -------------- */

function loop() {
  var last = now;
  now = performance.now();
  delta = (now - last);
  TIME += delta;

  debug_info[0] = "ent_count: " + entities.length;
  debug_info[1] = delta / 1000 + " ms";
  debug_info[2] = "fps: " + Math.trunc(1 / (delta / 1000));

  update();
  draw();
  
  window.requestAnimationFrame(loop);
}


function start() {
  // console.log(cbr);
  ctx.imageSmoothingEnabled = false;

  canvas.addEventListener("mousemove", handle_mouse_move);
  canvas.addEventListener("mousedown", handle_mouse_btn);
  canvas.addEventListener("mouseup", handle_mouse_btn);
  canvas.addEventListener("contextmenu", handle_context_menu);
  window.addEventListener("keydown", handle_keys);
  window.addEventListener("keyup", handle_keys);

  // todo disable back button mouse4 

  // load things
  load_ground(ground_ps);
  load_sprites();
  // TODO once assets have loaded start game

  //TODO: polyfill
  window.requestAnimationFrame(loop);
}





/* ------------- ENTRY POINT ------------- */
start();


/* TODO LIST
collision
  - BOX-CIRCLE (wip)

Sprites
  rendering (make better)
  animation


Map Generation
  stage completion
  random entities

Mob
  mob ai
  mob that sticks

Audio
*/