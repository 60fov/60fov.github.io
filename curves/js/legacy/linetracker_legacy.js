//TODO
//  timers
//  stats
//  gamemodes
//    continous tracking
//    fullscreen
//     fast lines
//        track lines afap
//     
//  options
//    colors
//    cursors size


function main() {

  var
    width,
    height,
    mouse

  // elements
  var
    statsElement


  // three.js
  var
    canvas,
    scene,
    renderer,
    camera,
    raycaster,
    w, h,
    curves,
    materials = {}

  // ui
  var 
    ui,
    score,
    timer
  
  // settings
  var 
    settings = {
      aa: true,
      radius: 20,
      ppl: 100,
      cis: 500
    }

  // logic
  var
    state,
    plane,
    lastEndPoint,
    pointIndex = 0,
    curvePoints = [],
    stats = {
      sessionDuration: 0,
      pointsTracked: 0,
      linesTracked: 0,
      accuracy: 0,
    }
    linesTracked = 0


  
  function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    w = 500;
    h = 500;
    canvas = document.querySelector("#canvas");
    statsElement = document.querySelector("#stats");
    updateStats();
    mouse = {
      ss: new THREE.Vector2(-100),
      ws: new THREE.Vector3(-100),
      pws: new THREE.Vector3(-100),
      r: settings.radius
    }

    window.onkeydown = function(event) {
      if (event.keyCode == 32) group.add(createCurve());
      if (event.keyCode == 70) group.add(createPoints());
    }

    window.onmousemove = function(event) {
      mouse.ss.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.ss.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: settings.aa});
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);
    raycaster = new  THREE.Raycaster();

    materials.line1 = new THREE.LineBasicMaterial( {color: 0x00ff00 } );
    materials.line2 = new THREE.LineBasicMaterial( {color: 0xff0000 } );
    materials.bg    = new THREE.MeshBasicMaterial( {color: 0x020f0f } );
    materials.circle = new THREE.MeshBasicMaterial( {color: 0xf0f000 } );
    materials.points = new THREE.PointsMaterial( {color: 0x00ff00 } );
    
    plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), materials.bg);
    scene.add(plane);
    
    curves = new THREE.Group();
    scene.add(curves);
    
    curves.add(createPoints());
  }

  function updateStats() {
    var out = ""
    // console.log(statsElement)
    statsElement.children[0].innerHTML = "session: " + Math.round(stats.sessionDuration / 1000);
    statsElement.children[1].innerHTML = "line: " + Math.trunc(pointIndex / settings.ppl * 100) + "%";
    statsElement.children[2].innerHTML = "curves tracked: " + stats.linesTracked;
    statsElement.children[3].innerHTML = "avg point dist: " + stats.pointDist / stats.pointsTracked;
    statsElement.children[4].innerHTML = "avg line time: " + Math.round(stats.sessionDuration / stats.linesTracked / 100);
    // statsElement.innerHTML = out;
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    width  = canvas.clientWidth  * pixelRatio | 0;
    height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function createCurve() {
    var mp = vec2(randmm(-w/2, w/2), randmm(-h/2, h/2))
    var ep = vec2(randmm(-w/2, w/2), randmm(-h/2, h/2))
    var p = [
      lastEndPoint,
      mp, mp, ep
    ];
    lastEndPoint = ep;
    var curve = new THREE.CubicBezierCurve(p[0], p[1], p[2], p[3]);
    curvePoints = curve.getPoints(settings.ppl);
    var geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    var object = new THREE.Line(geometry, materials.line1);
    return object;
  }

  function createPoints() {
    var mp = vec2(randmm(-w/2, w/2), randmm(-h/2, h/2))
    var ep = vec2(randmm(-w/2, w/2), randmm(-h/2, h/2))
    var p = [
      lastEndPoint,
      mp, mp, ep
    ];
    lastEndPoint = ep;
    var curve = new THREE.CubicBezierCurve(p[0], p[1], p[2], p[3]);
    curvePoints = curve.getPoints(settings.ppl);f
    var geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    var object = new THREE.Points(geometry, materials.points);
    return object;
  }

  

  function update(delta) {
    stats.sessionDuration = delta;
    raycaster.setFromCamera(mouse.ss, camera);
    let intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
      mouse.pws = mouse.ws;
      mouse.ws = intersects[0].point;
    }

    for(var i = 0; i <= settings.cis; i++) {
      let c = lerp2(mouse.pws, mouse.ws, i / settings.cis);

      var dist = dist2(c, curvePoints[pointIndex])
      if (dist <= mouse.r) {
        
        stats.pointsTracked += 1
        pointIndex += 1
      
        if (pointIndex >= settings.ppl) {
          pointIndex = 0;
          stats.linesTracked += 1;
          curves.add(createPoints());
          curves.remove(curves.children[0]);
        }
      }
    }
    
    updateStats();
  }

  function render() {

    renderer.render(scene, camera);

  }

  function loop(delta) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    update(delta);
    render();

    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);
}


main();
