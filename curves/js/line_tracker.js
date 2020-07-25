let game_modes = ["ubc"];
let game_mode = game_modes[0];

let points_per_line = 100;
let circle_interp_step = 100;

let plane;
let curves;
let last_end_point;
let point_index = 0;
let paused = false;
let started = false;

let w2, h2;
let material = {};
let raycaster;
let mouse = {};

let stats = {};

let keybinds = {
  27: play_pause,
  80: play_pause,
  82: reset
};

function line_tracker_init() {
  w2 = width / 2;
  h2 = height / 2;
  curves = new THREE.Group();
  plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial( { color: 0x49585A } ));
  scene.add(curves);
  scene.add(plane);

  raycaster = new THREE.Raycaster();
  mouse.ss  = vec2(-9999, -9999);
  mouse.ws  = vec2(-9999, -9999);
  mouse.pws = mouse.ws;
  mouse.r   = 20;
  window.addEventListener("mousemove", mouse_tracker)
  window.addEventListener("keydown", check_keys)
  
  reset();
}

function game_mode_init() {
  switch(game_mode) {
    case game_modes[0]:
      material.line1 = new THREE.LineBasicMaterial( {color: 0x50D8D7 } );
      material.line2 = new THREE.LineBasicMaterial( {color: 0xF76F8E } );
      last_end_point = vec2(randmm(-w2, w2), randmm(-h2, h2));
      create_curve();
      create_curve();
      break;
  }
}

function create_curve() {
  let p = [];
  switch (game_mode) {
    case game_modes[0]:
      let p = vec2(randmm(-w2, w2), randmm(-h2, h2));
      let end_point = vec2(randmm(-w2, w2), randmm(-h2, h2));
      p[0] = last_end_point;
      p[1] = p;
      p[2] = p;
      p[3] = end_point;
      last_end_point = end_point;
      let curve = new THREE.CubicBezierCurve(p[0], p[1], p[2], p[3]);
      let points = curve.getPoints(points_per_line);
      let geometry = new THREE.BufferGeometry().setFromPoints(points);

      let object = new THREE.Line(geometry, material.line1);
      if (curves.children.length == 0) {
        curves.add(object);
      } else if (curves.children.length == 1) {
        curves.add(object);
        curves.children[1].material = material.line2;
      } else {
        curves.children.reverse();
        curves.children.pop();
        curves.add(object);
        curves.children[0].material = material.line1;
        curves.children[1].material = material.line2;
      }
      break;
  }
  
}

function update_curves(delta) {
  if (paused) return

  if (started) {
    stats.time = (+stats.time + delta / 1000).toFixed(2);
    stats["avg track time"] = (+stats.time / stats.tracked).toFixed(2);
  }
  
  raycaster.setFromCamera(mouse.ss, camera);
  let intersects = raycaster.intersectObject(plane);
  if (intersects.length > 0) {
    mouse.pws = mouse.ws;
    mouse.ws = intersects[0].point;
  }

  for(let i = 0; i <= circle_interp_step; i++) {
    let c = lerp2(mouse.pws, mouse.ws, i / circle_interp_step);
    var dist = dist2(c, curve_point(0, point_index));
    if (dist <= mouse.r) {
      if (!started) started = true;
      point_index += 1
      if (point_index >= points_per_line) {
        point_index = 0;
        create_curve();
        stats.tracked += 1;
      }
      stats.progress = (point_index / points_per_line * 100).toFixed(0) + "%";

    }
  }

}

function curve_points(index) {
  return curves.children[0].geometry.attributes.position.array;
}

function curve_point(curve_index, point_index) {
  let points = curve_points(curve_index) 
  return vec2(points[point_index * 3 + 0], points[point_index * 3 + 1]);
}

function mouse_tracker(event) {
  let cx = (window.innerWidth - width) / 2
  let cy = (window.innerHeight - height) / 2
  mouse.ss.x = ( (event.clientX - cx) / width ) * 2 - 1;
  mouse.ss.y = - ( (event.clientY - cy) / height ) * 2 + 1;
}

function play_pause() {
  paused = !paused;
}

function reset() {
  started = false;
  paused = false;
  stats = new Stats();
  curves.children = [];
  game_mode_init();
}

function Stats() {
  this.time = 0
  this.tracked = 0
  this.progress = 0
  this["avg track time"] = 0
}

function check_keys(event) {
  for (let key in keybinds) {
    if (event.keyCode == key) keybinds[key]()
  }
}