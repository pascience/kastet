let rgb_for_color = {
  red: [1.0, 0, 0],
  green: [0, 1.0, 0],
  blue: [0, 0, 1.0],
  yellow: [1.0, 1.0, 0],
}
let piece_dimension = [0.4, 0.8, 0.1]


let controls = (() => {
  let rootElement = document.querySelector("#controls")
  let COLOR = 0, VECTOR = 1
  let values = {}

  function vectorToString(vector) {
    return `[${vector.map(x => ''+x).join(",")}]`
  }

  function addControl(controlType, controlName, initialValue, options={}) {
    values[controlName] = initialValue

    let visible = options.visible == null ? true : options.visible
    if(!visible) {
      return
    }

    let container = document.createElement("div")
    container.setAttribute("class", "control")
    {
      let name = document.createElement("div")
      name.setAttribute("class", "control__name")
      name.innerHTML = controlName
      container.appendChild(name)

      let value_text = document.createElement("div")
      value_text.setAttribute("class", "control__value")
      value_text.innerHTML = vectorToString(initialValue)
      container.appendChild(value_text)

      for(let component = 0; component < 3; component++) {
        let element = document.createElement("input")
        element.setAttribute("type", "range")
        element.setAttribute("min", "0")
        element.setAttribute("max", "1")
        element.setAttribute("step", "0.01")
        element.setAttribute("value", initialValue[component])
        element.setAttribute("class", "component")
        element.addEventListener("change", () => {
          values[controlName][component] = element.value
          value_text.innerHTML = vectorToString(initialValue)
        })
        container.appendChild(element)
      }
    }
    rootElement.appendChild(container)
  }

  function getValue(controlName) {
    return values[controlName]
  }

  function debug() {
    console.log(values)
  }

  return { getValue, addControl, COLOR, VECTOR, debug }
})()
controls.addControl(controls.COLOR, "uAmbientLightColor", [0.5, 0.5, 0.5], { visible: true })
controls.addControl(controls.COLOR, "uDirLight1Color", [0.5, 0.5, 0.75], { visible: true })
controls.addControl(controls.VECTOR, "uDirLight1Vector", [0.3, 1, 0], { visible: true })
controls.addControl(controls.COLOR, "uDirLight2Color", [0.2, 0.2, 0.05], { visible: true })
controls.addControl(controls.VECTOR, "uDirLight2Vector", [0, 0, 1], { visible: true })

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

let lighten = (rgb, amount) => rgb.map(x => Math.min(1.0, x*(1.0+amount)))

let useColor = (rgb) => {
  gl.uniform3fv(ngl.locations.uVertexColor, rgb)
}

let drawCubeElements = () => { gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0) }

let drawCube = ({ x, y, z }) => {
  gl.uniformMatrix4fv(ngl.locations.uModelMatrix, false, new Float32Array(multiplyArrayOfMatrices([
    translateMatrix(x, y, z),
    scaleMatrix(0.5, 0.5, 0.5)
  ])))
  drawCubeElements()
}

let drawPieceElement = ({ x, y, z }) => {
  gl.uniformMatrix4fv(ngl.locations.uModelMatrix, false, new Float32Array(multiplyArrayOfMatrices([
    translateMatrix(x, y, z),
    scaleMatrix(...piece_dimension),
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
      drawPieceElement({
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

  { // lights
    gl.uniform3fv(ngl.locations.uAmbientLightColor, controls.getValue("uAmbientLightColor"))
    gl.uniform3fv(ngl.locations.uDirLight1Color, controls.getValue("uDirLight1Color"))
    gl.uniform3fv(ngl.locations.uDirLight1Vector, controls.getValue("uDirLight1Vector"))
    gl.uniform3fv(ngl.locations.uDirLight2Color, controls.getValue("uDirLight2Color"))
    gl.uniform3fv(ngl.locations.uDirLight2Vector, controls.getValue("uDirLight2Vector"))
  }

  let cumulative_color_offset = 0;

  ["red" , "green", "blue", "yellow"].forEach((color_name, color_number) => {
    useColor(rgb_for_color[color_name])
    pieces_for_color[color_name].forEach((piece_id, piece_number_for_this_color) => {
      drawPiece({
        piece_id,
        offset: [(cumulative_color_offset+piece_number_for_this_color)*piece_dimension[0]*2.5, 0, 0]
      })
    })
    cumulative_color_offset += number_of_pieces_for_color(color_name) + 0.5
  })

  let pos = camera.position.map(x => Math.floor(x*100)/100)
  textbox.println(`[${pos[0]},${pos[1]},${pos[2]}]`)
  textbox.println("move : directional keys")
  textbox.println("zoom : Z/S or mouse wheel")
  textbox.draw()
}
