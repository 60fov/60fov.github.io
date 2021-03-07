/* date high score reset when updating game */

let last = 0;
let date = new Date();
let spawner = {left: undefined, right: undefined, bottom: undefined, top: undefined};
let last_update = 1615097521500;

function update(delta) {
  if (just_down(keys.d)) app.debug.active = !app.debug.active;

  if (app.debug.active) {
    app.debug.lines[0] = `${mouse.x}, ${mouse.y}`;
    app.debug.lines[1] = `ent: ${app.game.entities.length}`
    if (just_down(m3())) {
      app.game.entities.push(new Enemy(mouse.x, mouse.y));
    }
  }

  
  switch(app.game.state) {
    case "start":
      app.game.player.update(delta);
      if (action_just_down("move")) app.game.state = "playing";
      break;
    case "playing":
      app.game.score += delta * 10;
      app.game.player.update(delta);

      app.game.entities.forEach((ent, i) => {
        app.game.entities[i].update(delta);
      });

      app.game.entities = app.game.entities.filter(e => !e.remove);

      if (app.game.highscore < app.game.score) {
        app.game.highscore = app.game.score;
        localStorage.getItem("hs_date", data.getTime());
      }
      
      break;
    case "over":

      if (down(m1()) || down(m2())) init();
      break;
  }

  update_input();
}

function render() {
  clear();

  switch(app.game.state) {
    case "start":
      app.game.player.render();
      draw_text("press space to move", "center", 400, "white", 30, "Arial");
      break;
    case "playing":
      app.game.player.render();
      app.game.entities.forEach(e => e.render());    
      break;
    case "over":
      render_rect(0, 0, app.width, app.height, "rgba(0, 0, 0, 0.5)");
      draw_text("Game Over", "center", "center", "white", 50, "Arial");
      draw_text("Click to run it back", "center", 400, "white", 30, "Arial");
      break;
  }

  draw_text(Math.trunc(app.game.score), "center", 30, "white", 20, "Arial");
  draw_text(Math.trunc(app.game.highscore), "center", 55, "rgba(255, 255, 255, 0.8)", 20, "Arial");
 
  if (app.debug.active) {
    draw_texts(app.debug.lines, 10, 10, "white", 20, "Arial");
  }
}

function loop(time) {
  // app.fps_meter.tickStart();
  var delta = (time - last) / 1000;
  last = time;
  
  app.time += delta;

  update(delta);
  render();
  
  // app.fps_meter.tick();
  window.requestAnimationFrame(loop);
}


function init() {
  // app.fps_meter = new FPSMeter({
  //   graph: true,
  //   maxFps: 144,
  // });

  app.sound = {};
  app.sound.bg = new Audio("assets/bg.mp3");
  app.sound.swim = new Audio("assets/swim.wav");
  app.sound.bg.volume = 0.1;
  app.sound.bg.loop = true;
  app.sound.swim.volume = 0.1;
  app.game.player = new Player();
  app.game.entities = [];

  let st = 2;
  let range = Math.PI * 0.50;
  let size = 50;
  let off = 50 + size;
  let left = -off;
  let right = app.width + off;
  let top = -off;
  let bottom = app.height + off;
  spawner.left = new EnemySpawner(left, 0, size, app.height, st, new Vector(1, 0), range);
  spawner.right = new EnemySpawner(right, 0, size, app.height, st, new Vector(-1, 0), range);
  spawner.top = new EnemySpawner(0, top, app.width, size, st, new Vector(0, 1), range);
  spawner.bottom = new EnemySpawner(0, bottom, app.width, size, st, new Vector(0, -1), range);

  app.game.entities.push(spawner.left);
  app.game.entities.push(spawner.right);
  app.game.entities.push(spawner.top);
  app.game.entities.push(spawner.bottom);
  

  if (localStorage.getItem("hs_date") < last_update) localStorage.setItem("highscore", 0);
  app.game.score = 0;
  app.game.highscore = localStorage.getItem('highscore') || 0;
  app.game.state = "start";
}

function start() {
  app.canvas = document.querySelector("canvas");
  app.ctx = app.canvas.getContext('2d');
  app.width = app.canvas.clientWidth;
  app.height = app.canvas.clientHeight;
  
  init_dom();
  init_input();
  init();

  if (app.music) {
    app.sound.bg.play();
  }

  window.requestAnimationFrame(loop);
}


start();