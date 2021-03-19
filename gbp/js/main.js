window.onload = start;

let last = 0;
let accum = 0;
let step = 1/200;

let app;
let game;

let fps_meter;

function start() {
  init_input();

  app = new App(240, 160, 3, 'section');
  game = new Game();

  fps_meter = new FPSMeter({
    maxFps: 144,
    graph: true
  });

  requestAnimationFrame(loop);
}


function loop(time) {
  fps_meter.tickStart();

  let delta = (time - last) / 1000;
  last = time;

  accum += delta;
  while (accum >= step) {
    game.update(step);
    accum -= step;
    
    update_input();
  }

  app.screen.clear();
  game.render();
  app.screen.swap();

  fps_meter.tick();

  requestAnimationFrame(loop);
}