function Game() {  
  this.time = 0;
  this.world = new World("one");
  this.player = new Player(this.world.spawn.x, this.world.spawn.y);
  this.over = false;
  
  this.update = dt => {
    if (!this.over) this.time += dt;
    this.player.update(dt);
    this.world.update(dt);
  }

  this.render = () => {
    this.world.render();
    this.player.render();    
  }

  this.reset = () => {
    this.world = new World("one");
    this.player = new Player(this.world.spawn.x, this.world.spawn.y);
    this.over = false;
    this.time = 0;
  }
}


function World(world_name) {
  let w = world[world_name];

  this.end = w.end;
  this.w = w.w;
  this.h = w.h;
  this.tileset = w.tileset;
  this.bgs = w.bgs;
  this.tiles = w.tiles;
  this.spawn = w.spawn;
  this.spawn.x = this.spawn.x || this.spawn.tx * this.tileset.ts;
  this.spawn.y = this.spawn.y || this.spawn.ty * this.tileset.ts;
  this.gravity = 8.5 * 100;
  this.friction = 0.2 * 100;

  this.entities = [];
  for (let i = 0; i < w.entities.length; i++) {
    let e = w.entities[i];
    let x = e.x || e.tx * this.tileset.ts;
    let y = e.y || e.ty * this.tileset.ts;
    switch (e.kind) {
      case "stage":
        this.entities[i] = new StageSwitch(x, y, e.stage);
        break;
      case "orb":
        this.entities[i] = new Orb(x, y);
        break;
      case "worm":
        this.entities[i] = new Worm(x, y);
        break;
      case "fly":
        this.entities[i] = new Fly(x, y);
        break;
    }
  }


  this.update = dt => {
    this.entities.forEach(e => {
      
      if (!e.static) {
        e.vel.y += this.gravity;
      }

      e.update(dt);
    });


    this.entities = this.entities.filter(e => !e.remove);
  }

  this.render = () => {
    this.bgs.forEach(bg => {
      let img = app.assets[bg.asset_name];
      let w = img.width;
      let h = img.height;
      app.ctx.drawImage(img, 0, 0, w, h);
    });

    let tileset = app.assets[this.tileset.asset_name];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let ti = this.tiles[x+y*this.w];
        if (ti == -1) continue;
        let ts = this.tileset.ts;
        let tsx = (ti % this.tileset.w) * ts;
        let tsy = Math.trunc(ti / this.tileset.w) * ts;
        let px = x * ts;
        let py = y * ts;
        let ps = ts;
        app.ctx.drawImage(tileset, tsx, tsy, ts, ts, px, py, ps, ps);
      }
    }

    this.entities.forEach(e => e.render());
  }
}

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.state = "idle";
  this.static = false;
  this.sprite = new Sprite(hero, this.state);
  this.flip = 0;
  this.prev_col_dir = {};

  this.vel = new Vector();
  this.speed = 90;
  this.jump_impulse = 250;
  this.air_jump_impulse = 270;

  this.jump_gems = 0;
  this.jumping = false;
  this.jump = 0;

  this.health = 3;
  this.hit_impulse = 80;
  
  this.kill = () => {
    this.state = "dying";
    this.sprite.repeat = false;
    // this.kill_time = 0;
  };

  this.hit = e => {
    this.health -= 1;
    // hearts[this.health].kill();
    if (this.health < 1) this.kill();
    else {
      this.state = "hit";
      this.vel.x = this.hit_impulse * -Math.sign(this.vel.x || -e.vel.x);
      this.vel.y = -this.hit_impulse * 2;
    }
  }

  this.update = dt => {
    if (this.state != "dying") {
      this.vel.y += game.world.gravity * dt;
      if (this.prev_col_dir.y != 0) this.vel.x += -this.vel.x * game.world.friction * dt;
  
      if (this.state == "hit") {
  
  
      } else {
        this.state = "idle";
  
        if (action_down("left")) {
          this.vel.x = -1 * this.speed;
          this.state = "run";
          this.flip = 1;
        }
  
        if (action_down("right")) {
          this.vel.x = 1 * this.speed;
          this.state = "run";
          this.flip = 0;
        }
  
        if (action_pressed("jump")) {
          if (!this.jumping) {
            this.vel.y = -this.jump_impulse;
            this.jumping = true;
            this.jump = 1;
          } else {
            if (this.jump_gems > 0) {
              this.vel.y = -this.air_jump_impulse;
              this.jump_gems--;
              this.jump++;
            }
          }
        }
      } 
      
      let v = new Vector(this.vel.x, this.vel.y);
      v.mul(dt);
      let col_dir = move(this, v);
      this.prev_col_dir = col_dir;
      
      if (col_dir.y) {
        this.vel.y = 0;
        if (col_dir.y > 0) {
          this.jumping = false;
          if (this.state == "hit") this.state = "idle";
        }
      }
      
      if (this.state != "hit") {
        if (col_dir.x) {
          this.vel.x = 0;
          if (this.vel.y == 0) this.state = "push";
        }
  
        if (this.vel.y > 0) this.state = "jump_fall";
        if (this.vel.y < 0) {
          
          if (this.jump < 2) {
            this.state = "jump_rise";
          } else {
            this.state = "ball";
          }
        }
      }
  
    } else {
      if (this.sprite.done) {
        game.reset();
      }
    }
  
    this.vel.x = abs(this.vel.x) < 0.00001 ? 0 : this.vel.x;
    this.vel.y = abs(this.vel.y) < 0.00001 ? 0 : this.vel.y;
    
    this.sprite.update(dt, this.state);
  }
  this.render = () => {

    this.sprite.render(this.x, this.y, this.flip);
  }
}

function StageSwitch(x, y, stage) {
  this.x = x;
  this.y = y;
  this.stage = stage;
  this.static = true;
  this.remove = false;
  this.state = 'idle';
  this.sprite = new Sprite(door, this.state, false);


  this.update = dt => {
    if (col_ent_hb(game.player, this)) change_world(this.stage);
  }
  this.render = () => {
    let x = this.x;
    let y = (this.y-8);
    this.sprite.render(x, y, 0);
  }
}

function Worm(x, y) {
  this.x = x;
  this.y = y;
  this.static = false;
  this.state = "move";
  this.sprite = new Sprite(worm, this.state);
  this.remove = false;

  this.vel = new Vector();
  this.dir = -1;
  this.speed = 10;

  this.kill = false;

  this.update = dt => {

    if (!this.kill) {
      this.vel.x = this.dir * this.speed * dt;
      
      let v = new Vector(this.vel.x, this.vel.y);
    
      this.col = move(this, v);
  
      if (this.col.x != 0) this.dir = -this.dir;
    }

    if (!this.kill && col_ent_hb(game.player, this)) {
      this.kill = true;
      this.state = 'hit';
      this.repeat = false;
      game.player.hit(this);
    }

    if (this.kill) {
      if (this.state == "hit") {
        if (this.sprite.done) this.state = 'dying';
      } else {
        if (this.sprite.done) this.remove = true;
      }
    }

    this.sprite.update(dt, this.state);
  }
  this.render = () => {
    this.sprite.render(this.x, this.y, 0);
  }
}

function Orb(x, y) {
  this.x = x;
  this.y = y;
  this.static = true;
  this.state = "idle";
  this.sprite = new Sprite(orb, this.state);
  this.kill = false;
  this.remove = false;

  this.update = dt => {

    if (!this.kill && col_ent_hb(game.player, this)) {
      this.kill = true;
      this.state = "collected";
      this.sprite.repeat = false;
      game.player.jump_gems++;
    }

    if (this.kill && this.sprite.done) this.remove = true;

    this.sprite.update(dt, this.state);
  }
  this.render = () => {
    this.sprite.render(this.x, this.y, 0);
  }
}

function Fly(x, y) {
  this.x = x;
  this.y = y;
  this.remove = false;

  this.static = false;
  this.state = "idle";
  this.sprite = new Sprite(fly, this.state);
  this.vel = new Vector();
  this.angle = 0;
  this.speed = 15;
  this.flip = 0;
  this.kill = false;

  this.update = dt => {
    if (!this.kill) {
      this.angle += Math.PI / 4 * dt;
      this.vel.x = Math.cos(this.angle) * this.speed * 1.5;
      this.vel.y = Math.sin(this.angle * 5) * this.speed;
      
      let v = new Vector(this.vel.x, this.vel.y);
      v.mul(dt);
      let col_dir = move(this, v);

      if (this.vel.x < 0) this.flip = 0;
      if (this.vel.x > 0) this.flip = 1;
    }
    
    if (!this.kill && col_ent_hb(game.player, this)) {
      this.kill = true;
      this.state = 'hit';
      this.repeat = false;
      game.player.hit(this);
    }

    if (this.kill) {
      if (this.state == "hit") {
        if (this.sprite.done) this.state = 'dying';
      } else {
        if (this.sprite.done) this.remove = true;
      }
    }

    this.sprite.update(dt, this.state);
  
  }
  this.render = () => {
    this.sprite.render(this.x, this.y, this.flip);
  }
}

function Sprite(data, state, repeat) {
  this.sheet = app.assets[data.sheet];
  this.hitbox = data.hitbox;
  this.ani = data.ani;
  this.frame = 0;
  this.time = 0;
  this.pose = this.ani[state || "idle"];
  this.w = this.pose.w;
  this.h = this.pose.h;
  this.repeat = repeat ?? true;
  this.done = false;
  
  this.update = (dt, state) => {
    if (this.pose != this.ani[state]) {
      this.frame = 0;
      this.time = 0;
      this.pose = this.ani[state];
      this.done = false;
    }
    
    if (this.done && !this.repeat) return;
    
    this.done = false;
    
    this.time += dt;
    frame_time = this.pose.f_dur[this.frame % this.pose.f_dur.length];

    if (this.frame == this.pose.frames-1 && this.time >= frame_time) this.done = true;

    if (this.time >= frame_time) {
      this.time -= frame_time;
      this.frame++;
    }

    if (this.frame >= this.pose.frames) this.frame = 0;

    this.w = this.pose.w;
    this.h = this.pose.h;
  }

  this.render = (x, y, flip) => {
    let ssx = (this.pose.x + this.frame) * this.w ?? this.pose.px + this.pose.w * this.frame;
    let ssy = (this.pose.y * 2 + 1 * flip) * this.h ?? this.pose.py + this.pose.h * flip;

    app.ctx.drawImage(this.sheet, ssx, ssy, this.w, this.h, trunc(x), trunc(y), this.w, this.h);
  }
}

function move(e, v) {
  let cd = {x: 0, y: 0};
  let hb = e.sprite.hitbox;
  let ts = game.world.tileset.ts;

  while (v.x != 0) {
    let dx = abs(v.x) < 1 ? v.x : v.x < 0 ? -1 : 1;

    let tile_top = e.y + hb.t;
    let tile_bot = e.y + e.sprite.h - hb.b;
    let tile_left = e.x + hb.l + dx;
    let tile_right = e.x  + e.sprite.w - hb.r + dx;

    
    let bounds_col = tile_left/ts < 0 || tile_right/ts >= game.world.w;
    tile_top = trunc(tile_top / ts);
    tile_bot = trunc(tile_bot / ts);
    tile_left = trunc(tile_left / ts);
    tile_right = trunc(tile_right / ts);

    
    let top_left_col = game.world.tiles[tile_left + tile_top * game.world.w] != -1;
    let top_right_col = game.world.tiles[tile_right + tile_top * game.world.w] != -1;
    let bot_left_col = game.world.tiles[tile_left + tile_bot * game.world.w] != -1;
    let bot_right_col = game.world.tiles[tile_right + tile_bot * game.world.w] != -1;
    
    if ((top_left_col || top_right_col || bot_left_col || bot_right_col) || bounds_col) {
      cd.x = dx;
      break;
    }
    
    e.x += dx;
    v.x -= dx;
  }

  while (v.y != 0) {
    let dy = abs(v.y) < 1 ? v.y : v.y < 0 ? -1 : 1;
    
    let tile_top = e.y + hb.t + dy;
    let tile_bot = e.y + e.sprite.h - hb.b + dy;
    let tile_left = e.x + hb.l;
    let tile_right = e.x  + e.sprite.w - hb.r;

    let bounds_col = tile_top/ts < 0 || tile_bot/ts >= game.world.h;
    tile_top = trunc(tile_top / ts);
    tile_bot = trunc(tile_bot / ts);
    tile_left = trunc(tile_left / ts);
    tile_right = trunc(tile_right / ts);

    let top_left_col = game.world.tiles[tile_left + tile_top * game.world.w] != -1;
    let top_right_col = game.world.tiles[tile_right + tile_top * game.world.w] != -1;
    let bot_left_col = game.world.tiles[tile_left + tile_bot * game.world.w] != -1;
    let bot_right_col = game.world.tiles[tile_right + tile_bot * game.world.w] != -1;
    
    if ((top_left_col || top_right_col || bot_left_col || bot_right_col) /*|| bounds_col*/) {
      cd.y = dy;
      break;
    }

    e.y += dy;
    v.y -= dy;
  }
  return cd;
}

function col_ent_hb(e1, e2) {
  let a = {
    l: e1.x + e1.sprite.hitbox.l,
    t: e1.y + e1.sprite.hitbox.t,
    r: e1.x + e1.sprite.w - e1.sprite.hitbox.r,
    b: e1.y + e1.sprite.h - e1.sprite.hitbox.b,
  }
  let b = {
    l: e2.x + e2.sprite.hitbox.l,
    t: e2.y + e2.sprite.hitbox.t,
    r: e2.x + e2.sprite.w - e2.sprite.hitbox.r,
    b: e2.y + e2.sprite.h - e2.sprite.hitbox.b,
  }
  return col_aabb_aabb(a, b);
}

function col_aabb_aabb(a, b) {
  var r = a.l > b.r;
  var l = a.r < b.l;
  var t = a.b < b.t;
  var b = a.t > b.b;
  return !(r|| l || t || b);
}

function change_world(w) {
  game.world = new World(w);
  if (game.world.end) game.over = true;
  game.player.x = game.world.spawn.x;
  game.player.y = game.world.spawn.y;
}