function Player(x, y) {
  this.x = x || app.width / 2;
  this.y = y || app.height / 2;
  this.r = 20;
  this.impulse = 1000;
  this.vel = new Vector();
  this.move_timer = new Timer(0.5, true, false);
  this.sprite = new Sprite(["assets/p1.png", "assets/p2.png", "assets/p3.png"], 1, false, false);
  
  this.update = (delta) => {
    this.sprite.update(delta);
    this.move_timer.update(delta);
    // app.debug.lines[1] = this.move_timer.cur;
    if (action_just_down("move") && this.move_timer.ding) {
      this.move_timer.reset();
      if (app.sfx) {
        app.sound.swim.currentTime = 0;
        app.sound.swim.play();
      }
      let dir = normalize(vv_sub(mouse, this));
      let iv = vs_mul(dir, this.impulse * delta);
      this.vel = vv_add(this.vel, iv);
    }

    let f = vs_mul(this.vel, 0.03);
    this.vel = vv_sub(this.vel, f);

    let x = this.x + this.vel.x;
    let y = this.y + this.vel.y;

    let lb = x-this.r < 0;
    let rb = x+this.r > app.width;
    let tb = y-this.r < 0;
    let bb = y+this.r > app.height;
    
    if (lb || rb) {
      this.vel.x = 0;
      if (lb) x = this.r;
      else if (rb) x = app.width - this.r;
    }

    if (tb || bb) {
      this.vel.y = 0;
      if (tb) y = this.r;
      else if (bb) y = app.height - this.r;
    }
    
    this.x = x;
    this.y = y;

  };

  this.render = () => {
    render_circle(this.x, this.y, this.r, "white");

    // render_sprite(this.sprite, this.x, this.y);
  };

  this.kill = () => {
    app.game.state = "over";
  };
}