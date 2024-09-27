import PicoCADViewer from "./assets/pico-cad-viewer.esm.js";

const canvas = document.getElementById("cad-viewer");

const viewer = new PicoCADViewer({
	canvas: canvas,
  resolution: {width: 500, height: 500, scale: 3},
});

// Load models from file, string or URL.
viewer.load("./assets/unnamed_4.txt");

const keys = Object.create(null);
window.onkeydown = event => {
	if (event.target === document.body && !event.ctrlKey && !event.metaKey) {
		event.preventDefault();
		const key = event.key.toLowerCase();
		keys[key] = true;
	}
};
window.onkeyup = event => {
	if (!event.ctrlKey && !event.metaKey) {
		event.preventDefault();
		keys[event.key.toLowerCase()] = false;
	}
};

// Draw the model manually or start a draw loop.
let spin = 0;

// App/renderer state
let cameraSpin = -Math.PI / 2;
let cameraRoll = 0.2;
let cameraRadius = 12;
let cameraTurntableSpeed = 0.75;
let cameraTurntableCenter = {x: 0, y: 1.5, z: 0};
let cameraTurntableAuto = true;
let cameraMode = 0;

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} x 
 */
function clamp(a, b, x) {
	return x < a ? a : (x > b ? b : x);
}

viewer.startDrawLoop((dt) => {
  // This callback is called before every frame is drawn.
  const lookSpeed = 1.2 * dt;

	let inputLR = 0;
	let inputFB = 0;
	let inputUD = 0;
	let inputCameraLR = 0;
	let inputCameraUD = 0;
	if (keys["w"]) inputFB += 1;
	if (keys["s"]) inputFB -= 1;
	if (keys["a"]) inputLR -= 1;
	if (keys["d"]) inputLR += 1;
	if (keys["q"] || keys["shift"] || keys["control"]) inputUD -= 1;
	if (keys["e"] || keys[" "]) inputUD += 1;
	if (keys["arrowleft"]) inputCameraLR -= 1;
	if (keys["arrowright"]) inputCameraLR += 1;
	if (keys["arrowup"]) inputCameraUD -= 1;
	if (keys["arrowdown"]) inputCameraUD += 1;

		// turntable
		cameraRoll += (inputFB + inputCameraUD) * lookSpeed;
		cameraTurntableCenter.y += inputUD * 3 * dt;

		if (cameraTurntableAuto) {
			cameraTurntableSpeed -= (inputLR + inputCameraLR) * 2 * dt;
			cameraTurntableSpeed = clamp(-2, 2, cameraTurntableSpeed);

			cameraSpin += cameraTurntableSpeed * dt;
		} else {
			cameraSpin += (inputLR + inputCameraLR) * lookSpeed;
		}

	viewer.setTurntableCamera(cameraRadius, cameraSpin, cameraRoll, cameraTurntableCenter);
	viewer.setLightDirectionFromCamera();
});
