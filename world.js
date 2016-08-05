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


function world_setup() {
  return {
    t: 0,
    frame: 0,
    camera: {
    	position: [20, 35, 20]
    }
  }
}

function world_step({ dt, state: { t, frame, camera }, keys }) {
	let camera_position = camera.position
	if(keys["ArrowRight"]) {
		camera_position[0] += 0.1
	}
	if(keys["ArrowLeft"]) {
		camera_position[0] -= 0.1
	}
	if(keys["ArrowDown"]) {
		camera_position[2] += 0.1
	}
	if(keys["ArrowUp"]) {
		camera_position[2] -= 0.1
	}
	if(keys["z"] || keys["Z"]) {
		camera_position[1] -= 0.1
	}
	if(keys["s"] || keys["S"]) {
		camera_position[1] += 0.1
	}
  return {
    t: t+dt,
    frame: frame+1,
    camera: { position: camera_position }
  }
}
