/**
 * art from this person https://o-lobster.itch.io/
 */
let app = {};
let mouse = {x: 0, y: 0, left: 0, right: 0};
let input = {up: 0, just_up: 1, down: 2, just_down: 3};
let action_binds = {
  left: ["KeyA"], 
  right: ["KeyD"], 
  jump: ["Space", "KeyUp", "KeyE"], suicide: ["KeyR"]};
let keys = {};
let assets = {};
let worlds = {};
let world;
let hearts = [];
let last = 0;


function loop(time) {
  app.fps.tickStart();

  let delta = (time - last) / 1000;
  last = time;

  /* update */
  world.update(delta);
  hearts.forEach((h, i) => hearts[i].update(delta));

  /* render */
  clear();
  world.render();
  hearts.forEach(h => h.render());
  let sx = Math.random() * world.player.kill_time * 20;
  let sy = Math.random() * world.player.kill_time * 20;

  app.main_ctx.drawImage(app.canvas, sx, sy);

  /* sanitize input for next cycle */
  for (const key in keys) {
    if (keys[key] % 2 != 0) keys[key]--;
  }
  
  app.fps.tick();
  requestAnimationFrame(loop);
}

function init() {
  app.fps = new FPSMeter({
    graph: true,
    maxFps: 144
  });
  
  app.scrn = {};
  app.scrn.ts = 16;
  app.scrn.scale = 3;
  app.scrn.tw = 15;
  app.scrn.th = 10;

  app.main_canvas = document.querySelector("canvas");
  app.main_canvas.width = app.scrn.ts * app.scrn.scale * app.scrn.tw;
  app.main_canvas.height = app.scrn.ts * app.scrn.scale * app.scrn.th;
  app.main_ctx = app.main_canvas.getContext("2d");
  app.main_ctx.imageSmoothingEnabled = false;

  app.canvas = document.createElement("canvas");
  app.canvas.width = app.scrn.ts * app.scrn.scale * app.scrn.tw;
  app.canvas.height = app.scrn.ts * app.scrn.scale * app.scrn.th;
  app.ctx = app.canvas.getContext("2d");
  app.ctx.imageSmoothingEnabled = false;
  app.w = app.canvas.clientWidth;
  app.h = app.canvas.clientHeight;

  window.addEventListener("keydown", key_handler);
  window.addEventListener("keyup", key_handler);
  
  load_assets();

  init_worlds();

}

function init_worlds() {
  for (const key in world_datas) {
    worlds[key] = new World(world_datas[key]);
  }
  world = worlds["one"];

  hearts = [];
  for (let i = 0; i < world.player.health; i++ ) {
    hearts.push(new Heart(i, 0));
  }
}

function start() {
  init();

  requestAnimationFrame(loop);
}


window.onload = start;

function change_world(w) {
  let p = world.player;
  p.x = w.spawn.x * app.scrn.ts;
  p.y = w.spawn.y * app.scrn.ts;

  world = w;
  world.player = p;
}

/* objects */
function World(world_data) {
  this.data = world_data;

  this.spawn = world_data.spawn;
  this.w = world_data.w;
  this.h = world_data.h;
  this.gravity = world_data.gravity || 280 * 0.045;
  this.friction = world_data.friction || 0.2;
  this.tiles = world_data.tiles;
  this.tileset = assets[world_data.tileset.asset_name];
  
  let px = this.spawn.x * app.scrn.ts;
  let py = this.spawn.y * app.scrn.ts;
  this.player = new Player(px, py);
  
  this.entities = [];
  this.time = 0;
  this.bgs = [];
  this.data.backgrounds.forEach((bg,i) => {
    let img = assets[bg.asset_name];
    let speed = bg.speed;
    this.bgs[i] = { img, speed };
  });

  this.data.entities.forEach((e, i) => {
    let x = e.x || e.tx * app.scrn.ts;
    let y = e.y || e.ty * app.scrn.ts;
    switch(e.kind) {
      case "stage":
        let ss = new StageSwitch(x,y, e.stage);
        this.entities.push(ss);
        break;
      case "goblin":
        let g = new Goblin(x,y);
        this.entities.push(g);
        break;
      case "worm":
        this.entities.push(new Worm(x, y));
        break;
      case "fly":
        this.entities.push(new Fly(x, y));
        break;
      case "orb":
        this.entities.push(new Orb(x, y));
        break;
    }
  });  
  this.update = delta => {
    this.time += delta;
    this.player.update(delta);

    this.entities.forEach((e, i) => {
      this.entities[i].update(delta);
    });

    this.entities = this.entities.filter(e => !e.remove);

    if (this.player.dead) init_worlds();
  };

  this.render = () => {
    this.bgs.forEach(bg => {
      let w = bg.img.width * app.scrn.scale;
      let h = bg.img.height * app.scrn.scale;
      app.ctx.drawImage(bg.img, 0, 0, w, h);
    });
    
    for (let y = 0; y < app.scrn.th; y++) {
      for (let x = 0; x < app.scrn.tw; x++) {
        let ti = this.tiles[x+y*this.w];
        if (ti == -1) continue;
        let ts = this.data.tileset.ts;
        let tx = (ti % this.data.tileset.w) * ts;
        let ty = Math.trunc(ti / this.data.tileset.w) * ts;
        let px = x * app.scrn.ts * app.scrn.scale;
        let py = y * app.scrn.ts * app.scrn.scale;
        let ps = app.scrn.ts * app.scrn.scale;
        app.ctx.drawImage(this.tileset, tx, ty, ts, ts, px, py, ps, ps);
      }
    }

    this.entities.forEach(e => e.render());
    if (!this.player.dead) this.player.render();
  };
}

function Heart(x, y) {
  this.x = 10 + (x*((16*app.scrn.scale)+10));
  this.y = 10;
  this.ani = heart.ani;
  this.af = 0;
  this.aft = 0;
  this.kill = false;
  this.state = "still";
  this.ss = assets[heart.sheet];

  this.kill = () => {
    this.state = "idle";
  }

  this.update = (delta) => {
    if (this.state == "idle") {
      update_ani(this, delta);
      let a = this.ani[this.state];
      if (this.af == a.frames-1) this.state = "empty";
    }
  }

  this.render = () => {
    if (this.state == "still") {
      let img = assets["heart"];
      let w = img.width * app.scrn.scale;
      let h = img.height * app.scrn.scale;
      app.ctx.drawImage(assets["heart"], this.x, this.y, w, h);
    } else if (this.state == "idle") {
      render_ani_sprite(this, this.x, this.y);
    } else if (this.state == "empty") {
      let img = assets["no_heart"];
      let w = img.width * app.scrn.scale;
      let h = img.height * app.scrn.scale;
      app.ctx.drawImage(assets["no_heart"], this.x, this.y, w, h);
    }
  }

}

function Player(x, y) {
  this.kind = "player";
  this.x = x;
  this.y = y;
  this.hb = {x: this.x+3, y: this.y+2, w: 10, h: 14};
  this.vel = new Vector();
  this.state = "idle";
  this.ani = hero.ani;
  this.af = 0;
  this.aft = 0;
  this.speed = 120;
  this.air_speed = 1;
  this.jumping = false;
  this.jump_gems = 0;
  this.jump_impulse = 235;
  this.hb = {x: 4, y: 2, w: 12, h: 14};
  this.sheet = assets[hero.sheet];
  this.flip_sheet = assets[hero.flip_sheet];
  this.ss = this.sheet;
  this.stage_hb = {x:this.x+6, y:this.y+6, w:1, h:1};
  this.cx = 3;
  this.cy = 2;
  this.cw = 10;
  this.ch = 14;
  this.r_off = 0;
  this.health = 3;
  this.dead = false;
  this.col_dir = {};
  this.kill_timer = 1;
  this.kill_time = 0;

  this.update = (delta) => {
    if (this.state == "dying") {
      let a = this.ani[this.state];
      if (this.af == a.frames-1) this.dead = true;
    } else {
      if (this.state != "hit") {
        this.state = "idle";
        if (keys[action_binds.suicide[0]] > 1) {
          this.kill_time += delta;
          if (this.kill_time >= this.kill_timer) this.kill();
        } else this.kill_time = 0;

        if (this.jumping) {
          if (keys[action_binds.left[0]] > 1) this.vel.x += -this.air_speed * delta;
          if (keys[action_binds.right[0]] > 1) this.vel.x += this.air_speed * delta;
          if (keys[action_binds.jump[0]] == 3 && this.jump_gems > 0) {
            this.vel.y = -this.jump_impulse;
            this.jump_gems--;
            this.jumping = true;
          }
        } else {
          if (keys[action_binds.left[0]] > 1) {
            this.vel.x = -1 * this.speed * delta;
            this.ss = this.flip_sheet;
            this.state = "run";
          }
          if (keys[action_binds.right[0]] > 1) {
            this.vel.x = 1 * this.speed * delta;
            this.ss = this.sheet;
            this.state = "run";
          }
          if (keys[action_binds.jump[0]] == 3 && !this.jumping) {
            this.vel.y = -this.jump_impulse * delta;
            this.jumping = true;
          }
        }
   
      }

      // world
      this.vel.y += world.gravity * delta;
      if (!this.state == "hit" && this.jumping) {
        this.state = this.vel.y < 0 ? "jump_rise" : "jump_fall";
      }

      if (this.col_dir.y) {
        this.vel.x += -this.vel.x * world.friction;
      } else {
        let f = (world.friction ** 20);
        this.vel.x += -this.vel.x * f;
      }
      

      let v = new Vector(this.vel.x, this.vel.y);
      let col_dir = move(this, v);
      this.col_dir = col_dir;

      if (v.x != 0 && col_dir.x) this.vel.x = 0;
      if (col_dir.y) {
        this.vel.y = 0;
        if (this.state == "hit") this.state = "idle";
        if (col_dir.y > 0) {
          this.jumping = false;
        }
      }

      this.vel.x = abs(this.vel.x) < 0.00001 ? 0 : this.vel.x;
      this.vel.y = abs(this.vel.y) < 0.00001 ? 0 : this.vel.y;
    }
  
    update_ani(this, delta);
    
    this.hb = {x: this.x+3, y: this.y+2, w: 10, h: 14};
    this.stage_hb = {x:this.x+6, y:this.y+6, w:1, h:1};
    // world.entities.forEach((e,i) => {
    //   world.entities[i].player_collision = col_aabb_aabb(this.stage_hb, e.hb);
    // });
  };

  this.kill = () => {
    this.state = "dying";
    this.af = 0;
    this.aft = 0;
    this.kill_time = 0;
  };

  this.hit = (e) => {
    this.health -= 1;
    hearts[this.health].kill();
    if (this.health < 1) this.kill();
    else {
      this.state = "hit";
      this.vel.x = 1.5 * -Math.sign(this.vel.x);
      this.vel.y = -1;
    }
  };

  this.render = () => {
    render_ani_sprite(this);
  };

}

function Worm(x, y) {
  this.kind = "worm";
  this.x = x;
  this.y = y;
  this.w = 12;
  this.h = 6;
  this.hb = {x: 1, y: 3, w: 14, h: 5}
  this.vel = new Vector();
  this.sheet = assets[worm.sheet];
  this.flip_sheet = assets[worm.flip_sheet];  
  this.ss = this.sheet;
  this.state = "move";
  this.ani = worm.ani;
  this.af = 0;
  this.aft = 0;
  this.speed = 5;
  this.dir = -1;
  // edge dectection
  this.turn_time = 0;
  this.turn_timer = 3;
  this.r_off = 0;
  this.cx = 1;
  this.cy = 1;
  this.cw = 15;
  this.ch = 6;
  this.kill =false; 

  this.update = (delta) => {
    if (!this.kill) this.state = "move";

    if (!this.kill) {
      this.state = "move";
      this.turn_time += delta;
      if (this.turn_time >= this.turn_timer) {
        this.turn_time -= this.turn_timer;
        this.dir = -this.dir;
      }  
      
      let s = this.speed * delta;
      if (this.dir < 0) {
        this.vel.x = -s;
        this.ss = this.flip_sheet;
      }
      if (this.dir > 0) {
        this.vel.x = s;
        this.ss = this.sheet;
      }

      this.vel.y += world.gravity;

      if (this.vel.x != 0) this.state = "move";
  
      let v = new Vector(this.vel.x, this.vel.y);
      let col_dir = move(this, v);
    }  else {
      this.vel.y += world.gravity;
      this.x += this.vel.x;
      this.y += this.vel.y;
    }
  

    this.hb = {x: this.x+1, y: this.y+3, w: 14, h: 5}
    if (!this.kill && col_aabb_aabb(world.player.hb, this.hb)) {
      this.state = "hit";
      this.vel.y = -0.5;
      this.kill = true;
      world.player.hit(this);
    }

    update_ani(this, delta);
  };
  
  this.render = () => {
    render_ani_sprite(this);
  };
}

function Fly(x, y) {
  this.kind = "fly";
  this.x = x;
  this.y = y;
  this.w = 8;
  this.h = 8;
  this.vel = new Vector();
  this.sheet = assets[fly.sheet];
  this.flip_sheet = assets[fly.flip_sheet];  
  this.ss = this.sheet;
  this.state = "idle";
  this.ani = fly.ani;
  this.af = 0;
  this.aft = 0;
  this.speed = 20;
  this.dir = -1;
  this.turn_time = 0;
  this.turn_timer = 1.5;
  this.r_off = 0;
  this.cx = 1;
  this.cy = 1;
  this.cw = 7;
  this.ch = 7;
  this.angle = 0;
  this.kill = false;

  this.update = (delta) => {
    if (!this.kill) this.state = "idle";

    if (!this.kill) {
      this.angle += Math.PI / 4 * delta;
      let s = this.speed * delta;
      this.vel.x = Math.cos(this.angle) * s * 2;
      this.vel.y = Math.sin(this.angle * 4) * s;
      let v = new Vector(this.vel.x, this.vel.y);
      let col_dir = move(this, v);
    }  else {
      this.vel.y += world.gravity;
      this.x += this.vel.x;
      this.y += this.vel.y;
    }

    if (!this.kill && col_aabb_aabb(world.player.hb, this)) {
      this.state = "hit";
      this.vel.y = -0.5;
      this.kill = true;
      
      world.player.hit(this);
    }

    update_ani(this, delta);
  };
  
  this.render = () => {
    render_ani_sprite(this);
  };
}

function Orb(x, y) {
  this.x = x;
  this.y = y;
  this.w = 8;
  this.h = 8;
  this.vel = new Vector();
  this.sheet = assets[orb.sheet];
  this.ss = this.sheet;
  this.state = "idle";
  this.ani = orb.ani;
  this.af = 0;
  this.aft = 0;
  this.kill = false;

  this.update = (delta) => {
    if (!this.kill && col_aabb_aabb(world.player.hb, this)) {
      this.kill = true;
      this.state = "collected";
      this.af = 0;
      this.aft = 0;
      world.player.jump_gems++;
    }

    if (this.kill) {
      let a = this.ani[this.state];
      if (this.af == a.frames-1) this.remove = true;
    }

    update_ani(this, delta);
  };
  
  this.render = () => {
    render_ani_sprite(this);
  };
}

function StageSwitch(x, y, stage, asset_name) {
  this.kind = "stage";
  this.x = x;
  this.y = y;
  this.stage = stage;
  this.sprite = assets[asset_name || "door"];
  this.hb = {x: this.x+((this.sprite.width-12)/2),y: this.y,w: this.sprite.width/4,h: this.sprite.height/2};
  this.player_collision = false;
  this.update = (delta) => {
    
    if (col_aabb_aabb(world.player.stage_hb, this.hb)) {
      change_world(worlds[this.stage]);
    }
  };

  this.render = () => {
    let x = this.x * app.scrn.scale;
    let y = (this.y-8) * app.scrn.scale;
    let w = this.sprite.width * app.scrn.scale;
    let h = this.sprite.height * app.scrn.scale;
    app.ctx.drawImage(this.sprite, x, y, w, h);
  };
}


/* sprite */
function Sprite() {

}

function update_ani(e, delta) {
  if (e.aft > e.ani[e.state].f_dur) {
    e.af++;
    e.aft -= e.ani[e.state].f_dur;
  }
  if (e.af >= e.ani[e.state].frames) e.af = 0;
  e.aft += delta;
}



/* listeners */
function key_handler(e) {
  if (e.repeat) return;
  keys[e.code] = (e.type == "keyup" ? input["just_up"] : input["just_down"]);
}


/* loader */
function load_assets() {
  for (const asset of asset_files) {
    assets[asset.name] = new Image();
    assets[asset.name].src = "assets/" + asset.file;
  }
}


/* helpers */
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

function parse_hex_str(hex) {
  let c = {r: 0, g: 0, b: 0};
  if(!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return c;
  let str = hex.substring(1).split('');
  if (str.length == 3) {
    str = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  str = '0x'+str.join('');
  c.r = (str>>16)&255;
  c.g = (str>>08)&255;
  c.b = (str>>00)&255;
  return c;
}

function hitbox(e) {
  // this.sprite
}


function move(e, v) {
  let cd = {x: 0, y: 0};
  while (v.x != 0) {
    let dx = abs(v.x) < 1 ? v.x : v.x < 0 ? -1 : 1;
    
    let tt = trunc((e.y+e.cy) / app.scrn.ts);
    let tl = trunc((e.x+dx+e.cx) / app.scrn.ts);
    let tb = trunc((e.y+e.cy+e.ch) / app.scrn.ts);
    let tr = trunc((e.x+dx+e.cx+e.cw) / app.scrn.ts);
    let tlc = world.tiles[tl+tt*world.w] != -1;
    let trc = world.tiles[tl+tb*world.w] != -1;
    let blc = world.tiles[tr+tt*world.w] != -1;
    let brc = world.tiles[tr+tb*world.w] != -1;
    
    if ((tlc || trc || blc || brc)) {
      cd.x = dx;
      break;
    }
    
    e.x += dx;
    v.x -= dx;
  }

  while (v.y != 0) {
    let dy = abs(v.y) < 1 ? v.y : v.y < 0 ? -1 : 1;
    
    let tl = trunc((e.x+e.cx) / app.scrn.ts);
    let tr = trunc((e.x+e.cx+e.cw) / app.scrn.ts);
    let tt = trunc((e.y+dy+e.cy) / app.scrn.ts);
    let tb = trunc((e.y+dy+e.cy+e.ch) / app.scrn.ts);
    let tlc = world.tiles[tl+tt*world.w] != -1;
    let trc = world.tiles[tl+tb*world.w] != -1;
    let blc = world.tiles[tr+tt*world.w] != -1;
    let brc = world.tiles[tr+tb*world.w] != -1;

    if ((tlc || trc || blc || brc)) {
      cd.y = dy;
      break;
    }
    
    e.y += dy;
    v.y -= dy;
  }
  return cd;
}

function col_aabb_aabb(a, b) {
  var r = a.x   > b.x+b.w;
  var l = a.x+a.w  < b.x;
  var t = a.y+a.h < b.y;
  var b = a.y    > b.y+b.h;
  return !(r|| l || t || b);
}

/* render */
function clear() {
  app.ctx.clearRect(0, 0, app.w, app.h);
}

function render_data(data, x, y) {
  app.ctx.putImageData(data, x, y);
}

function render_rect(x, y, w, h, c) {
  app.ctx.fillStyle = c;
  app.ctx.fillRect(x, y, w, h);
}

function render_ani_sprite(e,x, y) {
  let sw = e.ani[e.state].w;
  let sh = e.ani[e.state].h;
  let sx = (e.ani[e.state].x + e.af) * sw;
  let sy = e.ani[e.state].y * sh;
  let dx = x || trunc((e.x) * app.scrn.scale);
  let dy = y ||trunc(e.y * app.scrn.scale);
  let dw = sw * app.scrn.scale;
  let dh = sh * app.scrn.scale;
  app.ctx.drawImage(e.ss, sx, sy, sw, sh, dx, dy, dw, dh);
}



function echo(v) {
  console.log(v);
}