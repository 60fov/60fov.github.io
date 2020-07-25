const debug = true;

var scoreElement;

var scene, camera, renderer;

var width, height;
var w, h;
var scale; 

var curves = [];
var points = [];
var plane, circle;
var numOfPoints = 50;
var pointIndex = 0;
var lastEndPoint = new THREE.Vector2(0, 0);

var raycaster = new THREE.Raycaster();
var mouse = {
  ss: new THREE.Vector2(),
  ws: new THREE.Vector3(),
  r: 10
}


function main() {
  scoreElement = document.querySelector("#score");
  canvas = document.querySelector("#canvas");
  renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

  width = window.innerWidth;
  height = window.innerHeight;
  w = 500;
  h = 500;
  scale = 1;
  camera = new THREE.OrthographicCamera(width / -2 / scale, width / 2 / scale, height / 2 / scale, height / -2 / scale,  1, 500 );
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  var material = new THREE.MeshBasicMaterial( {color: 0x020f0f, side: THREE.DoubleSide} );
  plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  scene.add(plane);

  var m1 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  var m2 = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
  var m3 = new THREE.PointsMaterial( { color: 0x0000ff } );
  var cmat = new THREE.MeshBasicMaterial( { color: 0xf0f000 } );
  circle = new THREE.Mesh( new THREE.CircleGeometry( mouse.r, 32 ), cmat );
  // scene.add( circle );


  function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.ss.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.ss.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  
  window.onmousemove = onMouseMove;

  function randomPoint() {
    var w = width / 50
    var h = height / 50
    var rx = (Math.random() * w) - (w / 2)
    var ry = (Math.random() * h) - (h / 2)
    return [rx, ry]
  }

  function randmm(min, max) {
    return min + Math.random() * (max - min);
  }

  function diff(x, y) {
    return Math.abs(x - y);
  }

  function createCurve(x, y) {
    var p = [
      lastEndPoint,
      new THREE.Vector2(randmm(-w/2, w/2), randmm(-h/2, h/2)),
      new THREE.Vector2(randmm(-w/2, w/2), randmm(-h/2, h/2)),
      new THREE.Vector2(randmm(-w/2, w/2), randmm(-h/2, h/2)),
    ];
    lastEndPoint = p[3];
    var curve = new THREE.CubicBezierCurve( p[0], p[1], p[2], p[3] );
  
    var bPoints = curve.getPoints( numOfPoints );
    var geometry = new THREE.BufferGeometry().setFromPoints( bPoints );
  
    var curveObject = new THREE.Line( geometry, m1 );
    scene.add(new THREE.Points(geometry, m3));

    if (curves.length < 2) {
      curves.push(curveObject);
      points.push(bPoints);
      curves[0].material = m2;
    } else {
      curves = curves.reverse();
      scene.remove(curves.pop());
      curves.push(curveObject);
      
      points = points.reverse();
      scene.remove(points.pop());
      points.push(bPoints);
      
      curves[0].material = m2;
    }
    // scene.add(curveObject);
  }

  createCurve();
  createCurve();

  function dist2(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function updateCurves() {
    scoreElement.innerHTML = pointIndex;
    circle.position.x = mouse.ws.x;
    circle.position.y = mouse.ws.y;
    if (dist2(mouse.ws, points[0][pointIndex]) <= mouse.r) {
      pointIndex += 1;
      if (pointIndex >= numOfPoints) {
        createCurve();
        pointIndex = 0;
      }
    }
  }

  function key(event) {
    if (event.keyCode == 32) createCurve();
  }

  document.onkeydown = key;

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    
    raycaster.setFromCamera(mouse.ss, camera);
    
    let intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
      mouse.ws = intersects[0].point;
    }
    updateCurves();
    
    
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();