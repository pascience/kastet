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

function center_of_piece(piece_id) {
	let piece = puzzle_models[piece_id]
	let height = piece.length/2
	return [1,1+Math.floor(height/2)]
}
