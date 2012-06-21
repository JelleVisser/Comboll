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
  
	for (var i = 0; i < three.cubes.length; i++) {
	  var cube = three.cubes[i];
	  cube.position.x -= Game.speed * timeDiff;
	  if (cube.position.x < -1500) {
			cube.position.x = Math.random() * 500 + 1500;
			cube.position.z = Math.random() * 800 - 400;
	  }
	  //console.log(cube.position.x);
	}
	
  if (Game.keysPressed["left"]) {
    three.sphere.position.x -= Game.ballSpeed * timeDiff;
  }
  if (Game.keysPressed["right"]) {
    three.sphere.position.x += Game.ballSpeed * timeDiff;
  }

	if (Game.keysPressed["space"]) {
		Game.started = true;
		three.sphere.position.z = Game.startPosition;
		three.sphere.fallSpeed = 0;
	}
	
	if (Game.started) {
		three.sphere.fallSpeed += Game.gravity * timeDiff;
		three.sphere.position.z += three.sphere.fallSpeed * timeDiff;
		if (collides(three.cubes, three.sphere)) {
			three.sphere.fallSpeed *= -1 * 1.08;
			three.sphere.fallSpeed = Math.min(three.sphere.fallSpeed, Game.maxFallSpeed);
			three.sphere.fallSpeed = Math.max(three.sphere.fallSpeed, Game.minBounceSpeed);
		}
	}
	
	if (three.sphere.position.z < -1000) {
		Game.started = false;
		reset();
	}
	
	//TODO camera
	// 600
	//three.camera.position.y = 600 * Math.sin(time / 1000);
  //three.camera.position.x = 600 * Math.cos(time / 1000);
	//three.camera.position.z = three.sphere.position.z;
	three.camera.position.y = -1200 - (-three.sphere.position.z / 2);
	//three.camera.lookAt(new THREE.Vector3(0, 0, 0));
	
  lastTime = time;

  // render
  three.renderer.render(three.scene, three.camera);

  // request new frame
  requestAnimFrame(function () {
    animate(lastTime, three);
  });
};

function reset() {
	Game.three.sphere.position.z = Game.startPosition;
	Game.three.sphere.position.x = 0;
}

function collides(list, object) {
	for (var i = 0; i < list.length; i++) {
	  var item = list[i];
		if (item.position.x - item.width / 2 < object.position.x &&
				item.position.x + item.width / 2 > object.position.x &&
				item.position.z + item.height / 2 > object.position.z - object.boundRadius &&
				item.position.z - item.height / 2 < object.position.z + object.boundRadius) {
			object.position.z = item.position.z + item.height / 2 + object.boundRadius;
			return true;
		}
	}
	return false;
}

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
  //camera.rotation.x = 45 * (Math.PI / 180);
	camera.lookAt(new THREE.Vector3(0, 0, 400));
  scene.add(camera);


  // material
  var blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  var greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  var cubes = new Array();
  for (var i = 0; i < 15; i++) {
    var cube = new THREE.Mesh(new THREE.CubeGeometry(400, 50, 20), blueMaterial);
    cube.position.x = Math.random() * 5000 + 1500;
    cube.position.z = Math.random() * 800 - 400;
		cube.width = 400;
		cube.height = 20;
		cube.depth = 50;
    scene.add(cube);
    cubes.push(cube);
  }


  // sphere

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), greenMaterial);
  sphere.position.z = Game.startPosition;
	sphere.fallSpeed = 0;
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

  animate(+new Date(), Game.three);
};

var initKeyboardEvent = function () {
  window.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) { Game.keysPressed["left"] = true; return; }
    if (event.keyCode === 39) { Game.keysPressed["right"] = true; return; }
		if (event.keyCode === 32) { Game.keysPressed["space"] = true; return; }
  }, false);
  window.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) { Game.keysPressed["left"] = false; return; }
    if (event.keyCode === 39) { Game.keysPressed["right"] = false; return; }
		if (event.keyCode === 32) { Game.keysPressed["space"] = false; return; }
  }, false);
};


var Game = {
  three: undefined,
  speed: 0.4,
  gravity: -0.002,
  ballSpeed: 0.7,
  maxFallSpeed: 1.2,
	minBounceSpeed: 1,
  keysPressed: new Array(),
	started: false,
	startPosition: 400
};
