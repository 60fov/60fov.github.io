let canvas, scene, renderer, camera;

let width, height;

let antialiasing = true;

function renderer_init()  {
  canvas = document.querySelector("#canvas");
  
  renderer_resize(500, 500);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: antialiasing});
  
  camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / -2, 1, 1000);
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);
}

function renderer_resize(w, h) {
  canvas.width = width = w;
  canvas.height = height = h;
}

function render() {
  renderer.render(scene, camera);
}