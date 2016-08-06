let textbox = (() => {
  let element = document.querySelector("#textbox")
  let text = ""
  function draw() {
    element.innerHTML = text
  }
  function clear() {
    text = ""
  }
  function println(txt) {
    text += txt + "<br>"
  }
  return { clear, println, draw }
})()

let rgb_for_color = {
  red: [1.0, 0.2, 0.2],
  green: [0.2, 1.0, 0.2],
  blue: [0.2, 0.2, 1.0],
  yellow: [1.0, 1.0, 0.2],
}

let lighten = (rgb, amount) => rgb.map(x => Math.min(1.0, x*(1.0+amount)))

let useColor = (rgb) => {
  gl.uniform3fv(ngl.locations.uVertexColor, rgb)
}

let drawCubeElements = () => { gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0) }

let piece_dimension = [0.4, 0.2, 0.8]

let drawCube = ({ x, y, z }) => {
  gl.uniformMatrix4fv(ngl.locations.uModelMatrix, false, new Float32Array(multiplyArrayOfMatrices([
    translateMatrix(x, y, z),
    // scaleMatrix(...piece_dimension),
    scaleMatrix(0.5, 0.5, 0.5)
  ])))
  drawCubeElements()
}

let drawPiece = ({ piece_id, offset }) => {
  let piece_model = puzzle_models[piece_id]
  for(let cell = 0; cell < piece_model.length; cell += 1) {
    let height = piece_model[cell]
    if(height < 1) {
      continue
    }
    for(let cur_height = 0; cur_height < height; cur_height += 1) {
      drawCube({
        x: offset[0] + piece_dimension[0]*(cell % 2),
        y: offset[1] + piece_dimension[1]*Math.floor(cell / 2),
        z: offset[2] + piece_dimension[2]*cur_height,
      })
    }
  }
}

function draw_frame({ dt, state: { frame, camera }, ngl, gl }) {
  textbox.clear()
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  { // setup the camera & perspective
    let view = multiplyArrayOfMatrices([
      translateMatrix(camera.position[0], camera.position[1], camera.position[2])
    ])
    gl.uniformMatrix4fv(ngl.locations.uViewMatrix, false, new Float32Array(view))

    let projection = perspectiveMatrix(70*Math.PI/180, ngl.width/ngl.height, 0.1, 50)
    gl.uniformMatrix4fv(ngl.locations.uProjectionMatrix, false, new Float32Array(projection))
  }

  useColor(rgb_for_color.yellow)
  drawCube({ x: 0, y: 0, z: 0 })
  useColor(rgb_for_color.red)
  drawCube({ x: 1, y: 0, z: 0 })
  useColor(rgb_for_color.green)
  drawCube({ x: 0, y: 1, z: 0 })
  useColor(rgb_for_color.blue)
  drawCube({ x: 0, y: 0, z: 1 })

  // ["red" , "green", "blue", "yellow"].forEach((color_name, color_number) => {
  //   useColor(rgb_for_color[color_name])
  //   pieces_for_color[color_name].forEach((piece_id, piece_number_for_this_color) => {
  //     drawPiece({
  //       piece_id,
  //       offset: [piece_number_for_this_color*piece_dimension[0]*2.5, color_number*piece_dimension[1]*9.5, 0]
  //     })
  //   })
  // })

  let pos = camera.position.map(x => Math.floor(x*100)/100)
  textbox.println(`[${pos[0]},${pos[1]},${pos[2]}]`)
  textbox.println("move : directional keys")
  textbox.println("zoom : Z/S or mouse wheel")
  textbox.draw()
}
