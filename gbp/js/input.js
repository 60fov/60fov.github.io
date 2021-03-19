let input_state = {up: 0, just_up: 1, down: 2, just_down: 3};
let keys = {};
let binds = {
  left: ["KeyA","KeyS"], 
  right: ["KeyD","KeyF"], 
  jump: ["Space", "KeyUp", "KeyW", "KeyE"],
  suicide: ["KeyR"]
};

function init_input() {
  window.addEventListener("keydown", key_handler);
  window.addEventListener("keyup", key_handler);
}

function update_input() {
  for (const key in keys) {
    if (keys[key] % 2 != 0) keys[key]--;
  }
}

function key_handler(e) {
  if (e.repeat) return;
  keys[e.code] = (e.type == "keyup" ? input_state.just_up : input_state.just_down);
}


let down = i => i > 1;
let up = i => !is_down(i);
let pressed = i => i == input_state.just_down;
let released = i => i == input_state.just_up;

let key = c => keys[c];
let key_down = c => down(keys[c]);
let key_up = c => up(keys[c]);
let key_pressed = c => pressed(keys[c]);
let key_released = c => released(keys[c]);

let action = a => binds[a];
let action_down = a => { for (const k of binds[a]) if (key_down(k)) return true; return false; }
let action_up = a => { for (const k of binds[a]) if (key_up(k)) return true; return false; }
let action_pressed = a => { for (const k of binds[a]) if (key_pressed(k)) return true; return false; }
let action_released = a => { for (const k of binds[a]) if (key_released(k)) return true; return false; }