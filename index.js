//Loop
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

//Render loop
function animate(lastTime, three) {
  // update
  var date = new Date();
  var time = date.getTime();
  var timeDiff = time - lastTime;
  if (lastTime != 0) {
    for (var i = 0; i < three.cubes.length; i++) {
      var cube = three.cubes[i];
      cube.position.x -= Game.speed * timeDiff;
      if (cube.position.x < -3000) {
        cube.position.x = Math.random() * 5000 + 2000;
        cube.position.z = Math.random() * 800 + 400;
      }
      //console.log(cube.position.x);
    }
  }

  if (Game.keysPressed["left"]) {
    three.sphere.position.x -= Game.ballSpeed * timeDiff;
  }
  if (Game.keysPressed["right"]) {
    three.sphere.position.x += Game.ballSpeed * timeDiff;
  }



  lastTime = time;

  // render
  three.renderer.render(three.scene, three.camera);

  // request new frame
  requestAnimFrame(function () {
    animate(lastTime, three);
  });
};

window.onload = function () {

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight - 5);
  document.body.appendChild(renderer.domElement);

  // scene
  var scene = new THREE.Scene();

  // camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.y = -600;
  camera.position.z = 800;
  camera.rotation.x = 45 * (Math.PI / 180);
  scene.add(camera);


  // material
  var blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  var greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  var cubes = new Array();
  for (var i = 0; i < 15; i++) {
    var cube = new THREE.Mesh(new THREE.CubeGeometry(400, 50, 20), blueMaterial);
    cube.position.x = Math.random() * 5000 + 2000;
    cube.position.z = Math.random() * 800 - 400;
    scene.add(cube);
    cubes.push(cube);
  }


  // sphere

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), greenMaterial);
  sphere.position.z = 100;
  scene.add(sphere);

  // create a point light
  var pointLight = new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 0;
  pointLight.position.y = -200;
  pointLight.position.z = 200;

  // add to the scene
  scene.add(pointLight);

  // create wrapper object that contains three.js objects
  Game.three = {
    renderer: renderer,
    camera: camera,
    scene: scene,
    cubes: cubes,
    sphere: sphere
  };

  initKeyboardEvent();

  animate(0, Game.three);
};

var initKeyboardEvent = function () {
  window.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) { Game.keysPressed["left"] = true; return; }
    if (event.keyCode == 39) { Game.keysPressed["right"] = true; return; }
  }, false);
  window.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) { Game.keysPressed["left"] = false; return; }
    if (event.keyCode === 39) { Game.keysPressed["right"] = false; return; }
  }, false);
};


var Game = {
  three: undefined,
  speed: 0.4,
  gravity: -0.4,
  ballSpeed: 0.7,
  ballMaxGravity: 1,
  keysPressed: new Array(),

};
