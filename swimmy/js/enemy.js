function Enemy(x, y, dir) {
  this.x = x;
  this.y = y;
  this.r = 28;
  this.speed = rand(100, 200);
  this.dir = dir || normalize(new Vector(rand(-1, 1), rand(-1, 1)));
  this.vel = new Vector();
  this.remove = false;
  this.birth = app.time;
  
  this.update = (delta) => {
    this.vel = vs_mul(this.dir, this.speed * delta);

    this.x += this.vel.x;
    this.y += this.vel.y;

    if (app.time - this.birth > 10) this.remove = true;
    let player = app.game.player;
    let pd = len(vv_sub(player, this));

    app.game.entities.forEach((ent, i) => {
      //TODO
    });

    if (pd < this.r + player.r) player.kill();

        
  };

  this.render = () => {
    render_circle(this.x, this.y, this.r, "red");
  };
}

function EnemySpawner(x, y, w, h, rate, dir, range) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.dir = dir;
  this.rate = rate;

  this.spawn_timer = new Timer(rand(rate-rate/2, rate+rate/2), true, true);

  this.update = (delta) => {
    this.spawn_timer.update(delta);
    if (this.spawn_timer.ding) {
      // console.log("spawn");
      let time = this.spawn_timer.time;
      this.spawn_timer.time = rand(rate-1, rate+1);
      // spawn enemy
      let x = rand(this.x, this.x + this.w);
      let y = rand(this.y, this.y + this.h);
      let a = angle(this.dir);
      let dir = vec_from_angle(rand(a-range/2, a+range/2));
      
      let enemy = new Enemy(x, y, dir);
      app.game.entities.push(enemy);
    }
  };

  this.render = () => {

  }
 }