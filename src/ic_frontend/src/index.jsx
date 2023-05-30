import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Clock } from 'three';


const clock = new Clock();
let lastScrollY = 0;
const scrollMultiplier = 0.001;

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); // Enable anti-aliasing
renderer.setPixelRatio(window.devicePixelRatio); // Set the pixel ratio for better quality on high-resolution screens
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set the background color to black
scene.fog = new THREE.FogExp2(0x000000, 0.02); // Add black fog to the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../assets/8k_moon.jpg');
const material = new THREE.MeshStandardMaterial({ map: texture });
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', onMouseMove, false);

// Add this after the GLTFLoader instance
const loadingScreen = document.getElementById('loading-screen');

camera.position.set(0, 15, 0);

let mixer;
function findObjectByName(object, name) {
  if (object.name === name) {
    console.log("Object found: ", object.name);
    return object;
  }

  for (let i = 0; i < object.children.length; i++) {
    const foundObject = findObjectByName(object.children[i], name);
    if (foundObject) {
      return foundObject;
    }
  }

  return null;
}


function onObjectClick(object) {
  if (object.name === 'NEEL-PROFILE') {
    window.open('neel.icp', '_blank');
  } else if (object.name === 'WEED-PROFILE') {
    window.open('https://example.com', '_blank'); // Replace 'https://example.com' with the actual link you want to use
  } else if (object.name === 'icpuzzleslink') {
    window.open('https://5sdab-uiaaa-aaaal-aalgq-cai.ic0.app/', '_blank');
  } else if (object.name === 'ICPUZZLEC') {
    window.open('https://entrepot.app/marketplace/icpuzzle', '_blank');
  }
  else if (object.name === 'PUZZLESC') {
    window.open('https://entrepot.app/marketplace/puzzles', '_blank');
  }
  else if (object.name === 'PUZZLE3DC') {
    window.open('https://entrepot.app/marketplace/puzzle', '_blank');
  }
  else if (object.name === 'TWITTER') {
    window.open('https://twitter.com/icpuzzles', '_blank');
  }
  else if (object.name === 'DISCORD') {
    window.open('https://discord.gg/qRaxTfhbev', '_blank');
  }
  else if (object.name === 'DISTRIKT') {
    window.open('https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/u/myartbar', '_blank');
  }
  else if (object.name === 'TELEGRAM') {
    window.open('https://t.me/puzzlebyN', '_blank');
  }
  else if (object.name === 'OPENCHAT') {
    window.open('https://oc.app/7ccm3-oaaaa-aaaar-anmoa-cai/?ref=clqia-gaaaa-aaaar-aiqca-cai', '_blank');
  }
}
 

const loader = new GLTFLoader();
let gltfCamera;
loader.load('../assets/PUZZLEWEBSITE.gltf', (gltf) => {
  const neelProfileObject = findObjectByName(gltf.scene, 'NEEL-PROFILE');
  if (neelProfileObject) {
    neelProfileObject.userData.onClick = onObjectClick;
  }

  const weedProfileObject = findObjectByName(gltf.scene, 'WEED-PROFILE');
  if (weedProfileObject) {
    weedProfileObject.userData.onClick = onObjectClick;
  }
  const icpuzzlesObject = findObjectByName(gltf.scene, 'icpuzzleslink');
  if (icpuzzlesObject) {
  icpuzzlesObject.userData.onClick = onObjectClick;
}
  const ICPUZZLECObject = findObjectByName(gltf.scene, 'ICPUZZLEC');
  if (ICPUZZLECObject) {
  ICPUZZLECObject.userData.onClick = onObjectClick;
}
const PUZZLESCObject = findObjectByName(gltf.scene, 'PUZZLESC');
  if (PUZZLESCObject) {
  PUZZLESCObject.userData.onClick = onObjectClick;
}
const PUZZLE3DCObject = findObjectByName(gltf.scene, 'PUZZLE3DC');
  if (PUZZLE3DCObject) {
  PUZZLE3DCObject.userData.onClick = onObjectClick;
}
const DISCORDObject = findObjectByName(gltf.scene, 'DISCORD');
  if (DISCORDObject) {
  DISCORDObject.userData.onClick = onObjectClick;
}
const DISTRIKTObject = findObjectByName(gltf.scene, 'DISTRIKT');
  if (DISTRIKTObject) {
  DISTRIKTObject.userData.onClick = onObjectClick;
}
const OPENCHATObject = findObjectByName(gltf.scene, 'OPENCHAT');
  if (OPENCHATObject) {
  OPENCHATObject.userData.onClick = onObjectClick;
}
const TWITTERObject = findObjectByName(gltf.scene, 'TWITTER');
  if (TWITTERObject) {
  TWITTERObject.userData.onClick = onObjectClick;
}
const TELEGRAMObject = findObjectByName(gltf.scene, 'TELEGRAM');
  if (TELEGRAMObject) {
  TELEGRAMObject.userData.onClick = onObjectClick;
}

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "MOON") {
      child.material = material;
    }
  });
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "WATER") {
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2eccff,
        metalness: 0,
        roughness: 0.2,
        transparent: true,
        transmission: 0.1, // Adjust this value to control the level of transparency
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        envMapIntensity: 1,
      });
  
      child.material = glassMaterial;
    }
    loadingScreen.style.display = 'none';

  });
  
    
  scene.add(gltf.scene);
  gltfCamera = gltf.cameras.find((cam) => cam.name === "HOMEPAGECAMERA");

  // Create the animation mixer and setup the animation
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.02); // Increase light intensity
pointLight.position.set(0, 5, 4);
scene.add(pointLight);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;

const orbitControls = document.getElementById('orbit-controls');
orbitControls.addEventListener('click', toggleCamera);

let useGLTFCamera = true;

function toggleCamera() {
  useGLTFCamera = !useGLTFCamera;
  controls.enabled = !controls.enabled;
}

function animate() {
  requestAnimationFrame(animate);

  const scrollY = window.pageYOffset;
  const scrollDelta = (scrollY - lastScrollY) * scrollMultiplier;
  lastScrollY = scrollY;

  if (mixer) {
    const delta = clock.getDelta() * Math.abs(scrollDelta);
    mixer.update(delta);
  }

  controls.update();
  if (useGLTFCamera && gltfCamera) {
    renderer.render(scene, gltfCamera);
  } else {
    renderer.render(scene, camera);
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

animate();

window.addEventListener('wheel', onScroll);


// Add this after the lastFrameNumber declaration
const frameDisplay = document.getElementById('frame-display');
let audioPlayed = false;
let lastFrameNumber = 0;

function onScroll(event) {
  event.preventDefault();

  const deltaY = event.deltaY;

  if (mixer && mixer._actions.length > 0) {
    const totalKeyframes = 360;
    const currentClip = mixer._actions[0]._clip;
    const clipDuration = currentClip.duration;
    const timeDelta = deltaY * scrollMultiplier;
    const newTimeInSeconds = mixer.time + timeDelta;

    if (newTimeInSeconds >= 0 && newTimeInSeconds < clipDuration) {
      mixer.setTime(newTimeInSeconds);
    } else if (newTimeInSeconds >= clipDuration) {
      mixer.setTime(clipDuration - 0.001);
    } else {
      mixer.setTime(0);
    }

    const frameNumber = Math.round(mixer.time * totalKeyframes);
    const cubeFallSound = document.getElementById('cube-fall-sound');

    if (frameNumber === 0) {
      audioPlayed = false;
    }

    if (frameNumber >= 1 && frameNumber <= 2400 && audioPermissionGranted && deltaY > 0 && !audioPlayed) {
      audioPlayed = true;
      cubeFallSound.play().catch((error) => {
        console.log('Audio playback error:', error);
      });
    }

    lastFrameNumber = frameNumber;

    // Update the frame display element
    //frameDisplay.textContent = 'Frame: ' + frameNumber;
  }
}



let audioPermissionGranted = false;
const startAudioButton = document.getElementById('start-audio');


// Add the event listener for the start audio button
startAudioButton.addEventListener('click', startAudio);



function startAudio() {
  const muteIcon = document.getElementById('mute-icon');
  const backgroundAudio = document.getElementById('background-audio');

  if (!audioPermissionGranted) {
    const cubeFallSound = document.getElementById('cube-fall-sound');
    cubeFallSound.play()
      .then(() => {
        audioPermissionGranted = true;
        cubeFallSound.pause(); // Ensure the audio is paused after permission is granted
        muteIcon.src = 'unmute-icon.svg';
        muteIcon.alt = 'Unmute';

        // Set the background audio volume and start playing
        backgroundAudio.volume = 0.35; // Set the volume to 50%
        backgroundAudio.play();
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
      });
  } else {
    if (muteIcon.src.endsWith('unmute-icon.svg')) {
      muteIcon.src = 'mute-icon.svg';
      muteIcon.alt = 'Mute';
      backgroundAudio.pause(); // Pause the background audio
    } else {
      muteIcon.src = 'unmute-icon.svg';
      muteIcon.alt = 'Unmute';
      backgroundAudio.play(); // Resume the background audio
    }
  }
}





document.getElementById('start-audio').addEventListener('click', startAudio);




window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use gltfCamera if it's available and active
  const activeCamera = useGLTFCamera && gltfCamera ? gltfCamera : camera;
  raycaster.setFromCamera(mouse, activeCamera);

  // Ensure we check all layers
  activeCamera.layers.set(0);

  const intersects = raycaster.intersectObjects(scene.children, true);

  let isClickableObject = false;

  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;
    const objectName = object.name.toLowerCase();

    if (objectName.startsWith('cube')) {
      const newMaterial = object.material.clone();
      newMaterial.color.setHex(Math.random() * 0xffffff);
      object.material = newMaterial;
    }

    // Check for specific object names
    if (
      object.userData.onClick ||
      objectName === 'TELEGRAM' ||
      objectName === 'DISTRIKT' ||
      objectName === 'OPENCHAT' ||
      objectName === 'NEEL-PROFILE' ||
      objectName === 'WEED-PROFILE'
    ) {
      isClickableObject = true;
      break;
    }
  }

  if (isClickableObject) {
    renderer.domElement.style.cursor = 'pointer';
  } else {
    renderer.domElement.style.cursor = 'default';
  }
}



window.addEventListener('mousedown', onMouseClick, false);

function onMouseClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use gltfCamera if it's available and active
  const activeCamera = useGLTFCamera && gltfCamera ? gltfCamera : camera;
  raycaster.setFromCamera(mouse, activeCamera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  for (let i = 0; i < intersects.length; i++) {
    let object = intersects[i].object;

    // Traverse up the object hierarchy to find either "NEEL-PROFILE", "WEED-PROFILE", or "icpuzzles.com" object
    while (object && object.name !== "NEEL-PROFILE" && object.name !== "WEED-PROFILE" && object.name !== "icpuzzleslink"&& object.name !== "ICPUZZLEC"&& object.name !== "PUZZLESC"&& object.name !== "PUZZLE3DC"&& object.name !== "OPENCHAT"&& object.name !== "DISTRIKT"&& object.name !== "DISCORD"&& object.name !== "TWITTER"&& object.name !== "TELEGRAM") {
      object = object.parent;
    }

    if (object && object.userData.onClick) {
      object.userData.onClick(object);
      break; // Add this line to break the loop after the onClick function is called
    }
  }
}
