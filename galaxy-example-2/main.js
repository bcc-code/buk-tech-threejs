import "./style.css";
import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  15000
);
camera.position.z = 250;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(1, 0.4, 0.01);
scene.fog = new THREE.Fog(scene.background, 3500, 15000);

const s = 25;
const geometry = new THREE.TorusGeometry(s, s, s);
const material = new THREE.MeshPhongMaterial({
  color: 0x00ffff,
  specular: 0xffffff,
  shininess: 50,
});

for (let i = 0; i < 3000; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
  mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
  mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;
  mesh.rotation.z = Math.random() * Math.PI;

  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  scene.add(mesh);
}

const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
dirLight.position.set(0, -1, 0).normalize();
dirLight.color.setHSL(0.1, 0.7, 0.5);
scene.add(dirLight);

const textureLoader = new THREE.TextureLoader();
const potionFlare = textureLoader.load("purple_flare.png");
addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
addLight(0.08, 0.8, 0.5, 0, 0, -1000);
addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

function addLight(h, s, l, x, y, z) {
  const light = new THREE.PointLight(0xffffff, 1.5, 2000);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);
  scene.add(light);

  const lensflare = new Lensflare();
  lensflare.addElement(new LensflareElement(potionFlare, 400, 0, light.color));
  light.add(lensflare);
}

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 2500;
controls.rollSpeed = Math.PI / 6;
controls.autoForward = false;
controls.dragToLook = false;

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}

animate();
