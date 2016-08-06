let puzzle_models = [
	[ // 9A
		2,2,
		1,1,
		1,1,
		1,1,
		0,1,
		1,1,
		1,1,
		1,1,
		2,2,
	], [ // 7B
		2,2,
		1,1,
		2,2,
		0,2,
		2,2,
		1,1,
		2,2,
	], [ // 7C
		2,2,
		2,2,
		2,2,
		1,1,
		2,2,
		2,2,
		2,2,
	], [ // 7D
		2,2,
		1,1,
		1,1,
		0,2,
		1,1,
		1,1,
		2,2,
	], [ // 7E
		2,2,
		2,2,
		1,1,
		2,2,
		2,2,
	], [ // 7F
		2,2,
		1,1,
		2,2,
	], [ // 7G
		2,2,
		0,1,
		2,2,
	]
]

let pieces_for_color = (() => {
	let a = 0, b = 1, c = 2, d = 3, e = 4, f = 5, g = 6
	let red = [a, b, b, e, e, f, g]
	let green = [a, c, c, e, e, f, f]
	let blue = [e, e, e, e, f, f, f, f, f, f, f, f]
	let yellow = [a, d, d, e, e, f, f]
	return {
		red, green, blue, yellow
	}
})()

function number_of_pieces_for_color(color_name) {
  return pieces_for_color[color_name].length
}


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
