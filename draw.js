let rgb_for_color = {
  red: [1.0, 0.2, 0.2],
  green: [0.2, 1.0, 0.2],
  blue: [0.2, 0.2, 1.0],
  yellow: [1.0, 1.0, 0.2],
}

let lighten = (rgb, amount) => rgb.map(x => Math.min(1.0, x*(1.0+amount)))

function draw_frame({ dt, state: { frame, camera }, ngl, gl }) {
  { // setup the camera & perspective
    let projection = perspectiveMatrix(70*Math.PI/180, ngl.width/ngl.height, 1, 50)
    let view = multiplyArrayOfMatrices([
      translateMatrix(camera.position[0], camera.position[1], camera.position[2]),
      rotateXMatrix(Math.PI/2),
    ])
    gl.uniformMatrix4fv(ngl.locations.uProjectionMatrix, false, new Float32Array(projection))
    gl.uniformMatrix4fv(ngl.locations.uViewMatrix, false, new Float32Array(view))
  }

  let drawCubeElements = () => { gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0) }
  let useColor = (rgb) => {
    gl.uniform3fv(ngl.locations.uVertexColor, rgb)
  }

  let drawCube = ({ x, y, z }) => {
    gl.uniformMatrix4fv(ngl.locations.uModelMatrix, false, new Float32Array(multiplyArrayOfMatrices([
      translateMatrix(x, y, z),
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
          x: offset[0] + cell % 2,
          z: offset[1] + Math.floor(cell / 2),
          y: offset[2] + cur_height
        })
      }
    }
  }

  ["red" , "green", "blue", "yellow"].forEach((color_name, color_number) => {
    useColor(rgb_for_color[color_name])
    pieces_for_color[color_name].forEach((piece_id, piece_number_for_this_color) => {
      drawPiece({
        piece_id,
        offset: [piece_number_for_this_color*3, color_number*10, 0]
      })
    })
  })
}
