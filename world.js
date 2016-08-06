function world_setup() {
  return {
    t: 0,
    frame: 0,
    camera: {
    	position: [15.18,4.1,15.18]
    }
  }
}

function world_step({ dt, state: { t, frame, camera }, keys, zoomDelta }) {
	let camera_position = camera.position
	if(keys["ArrowRight"]) {
		camera_position[0] += 0.1
	}
	if(keys["ArrowLeft"]) {
		camera_position[0] -= 0.1
	}
	if(keys["ArrowDown"]) {
		camera_position[1] -= 0.1
	}
	if(keys["ArrowUp"]) {
		camera_position[1] += 0.1
	}
	if(keys["z"] || keys["Z"]) {
		camera_position[2] -= 0.1
	}
	if(keys["s"] || keys["S"]) {
		camera_position[2] += 0.1
	}
	if(zoomDelta == 1) {
		camera_position[2] += 0.8
	}
	if(zoomDelta == -1) {
		camera_position[2] -= 0.8	
	}
  return {
    t: t+dt,
    frame: frame+1,
    camera: { position: camera_position }
  }
}
