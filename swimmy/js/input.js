function Mouse() {
  this.x = 0;
  this.y = 0;
  this.btns = [];
}

let mouse = new Mouse();
let keys = { };

let input_state = {
  "up": 0,
  "justup": 1,
  "down": 2,
  "justdown": 3
}


function init_input() {
  window.addEventListener("keydown", handle_keys);
  window.addEventListener("keyup", handle_keys);

  app.canvas.addEventListener("mousemove", handle_mouse_move);
  app.canvas.addEventListener("mousedown", handle_mouse_btn);
  app.canvas.addEventListener("mouseup", handle_mouse_btn);
  app.canvas.addEventListener("contextmenu", handle_context_menu);
}

function update_input() {
  for (const key in keys) {
    const state = keys[key];
    if (just(state)) keys[key]--;
  }

  for (let i = 0; i < mouse.btns.length; i++) {
    const btn = mouse.btns[i];
    if (just(btn)) mouse.btns[i]--;
  }
}

let just = input => input % 2 != 0
let down = input => input > 1
let up = input => !down(input)
let just_up = input => input == input_state["justup"]
let just_down = input => input == input_state["justdown"]
let m_btn = i => mouse.btns[i]
let m1 = () => m_btn(0)
let m2 = () => m_btn(2)
let m3 = () => m_btn(1)
let m4 = () => m_btn(3)
let m5 = () => m_btn(4)
let action_state = a => keys[app[a]]
let action_up = a => up(action_state(a))
let action_down = a => down(action_state(a))
let action_just_up = a => just_up(action_state(a))
let action_just_down = a => just_down(action_state(a))

function convert_mb_to_bind(b) {
  switch(b) {
    case 0: return "m1";
    case 1: return "m3";
    case 2: return "m2";
  }
}

function convert_bind_to_mb(b) {
  switch(b) {
    case "m1": return 0;
    case "m3": return 1;
    case "m2": return 2;
  }
}

/* ------------- EVENT HANDLERS ------------- */

function handle_context_menu(e) { e.preventDefault(); }

function handle_mouse_move(e) {
  mouse.x = e.x - app.canvas.getBoundingClientRect().x;
  mouse.y = e.y - app.canvas.getBoundingClientRect().y;
}

function handle_mouse_btn(e) {
  e.preventDefault();
  if (e.type == "mousedown") {
    // possible redundant
    if (down(mouse.btns[e.button])) mouse.btns[e.button] = input_state["down"];
    else mouse.btns[e.button] = input_state["justdown"];
  } else {
    if (up(mouse.btns[e.button])) mouse.btns[e.button] = input_state["up"];
    else mouse.btns[e.button] = input_state["justup"];
  }
}

function handle_keys(e) {
  e.preventDefault();
  if (e.type == 'keydown') {
    if (down(keys[e.key])) keys[e.key] = input_state["down"];
    else keys[e.key] = input_state["justdown"];
  } else {
    if (up(keys[e.key])) keys[e.key] = input_state["up"];
    else keys[e.key] = input_state["justup"];
  }
}