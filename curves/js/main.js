let last_time;


function start() {
  init();

  requestAnimationFrame(loop);
}

function stop() {
  cancelAnimationFrame(loop);
}

function init() {
  renderer_init();
  line_tracker_init();
  ui_init();
}

function update(delta) {
  update_curves(delta);
  update_ui(delta);
}

function draw() {
  render();
}

function loop(time) {
  let delta = time - (last_time ?? time);
  last_time = time;

  update(delta);
  draw();

  requestAnimationFrame(loop);
}

start();