let canvas = document.getElementById("sketch")

let ngl = {
  buffers: {},
  locations: {
    aVertexPosition: null,
    aVertexNormal: null,
    uVertexColor: null,
    uModelMatrix: null,
    uProjectionMatrix: null,
    uViewMatrix: null,
  },
  width: document.body.offsetWidth,
  height: document.body.offsetHeight,
  pressed_keys: {},
  mouseWheelDeltaY: 0,
}

canvas.width = document.body.offsetWidth
canvas.height = document.body.offsetHeight
window.addEventListener("resize", () => {
  ngl.width = document.body.offsetWidth
  ngl.height = document.body.offsetHeight
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight
})

window.addEventListener("keydown", function(event) {
  if(! event.repeat) {
    ngl.pressed_keys[event.key] = true
  }
}, true)
window.addEventListener("keyup", function(event) {
  delete ngl.pressed_keys[event.key]
}, true)
window.addEventListener("mousewheel", function(event) {
  ngl.mouseWheelDeltaY = event.deltaY > 0 ? 1 : (event.deltaY < 0 ? -1 : 0)
}, true)

let gl = canvas.getContext("webgl")
{ // setup WebGL
  gl.clearColor(0.4, 0.4, 0.5, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  let pgm = gl.createProgram()
  { // compile and link shaders into the program
    function createShader(source, type) {
      let shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let info = gl.getShaderInfoLog(shader)
        throw `Could not compile WebGL program.\n\n${info}`
      }
      return shader
    }
    let vertexShader = createShader(window.vertexSource, gl.VERTEX_SHADER)
    let fragmentShader = createShader(window.fragmentSource, gl.FRAGMENT_SHADER)
    gl.attachShader(pgm, vertexShader)
    gl.attachShader(pgm, fragmentShader)
    gl.linkProgram(pgm)
    if(!gl.getProgramParameter(pgm, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(pgm)
      throw `Could not link WebGL program.\n\n${info}`
    }
  }

  gl.useProgram(pgm)
  { // retrieve GLSL attribute/uniform locations
    ngl.locations.aVertexPosition = gl.getAttribLocation(pgm, "aVertexPosition")
    gl.enableVertexAttribArray(ngl.locations.aVertexPosition)
    ngl.locations.aVertexNormal = gl.getAttribLocation(pgm, "aVertexNormal")
    gl.enableVertexAttribArray(ngl.locations.aVertexNormal)

    ngl.locations.uVertexColor = gl.getUniformLocation(pgm, "uVertexColor")
    ngl.locations.uModelMatrix = gl.getUniformLocation(pgm, "uModelMatrix")
    ngl.locations.uProjectionMatrix = gl.getUniformLocation(pgm, "uProjectionMatrix")
    ngl.locations.uViewMatrix = gl.getUniformLocation(pgm, "uViewMatrix")

    ngl.locations.uAmbientLightColor = gl.getUniformLocation(pgm, "uAmbientLightColor")
    ngl.locations.uDirLight1Color = gl.getUniformLocation(pgm, "uDirLight1Color")
    ngl.locations.uDirLight1Vector = gl.getUniformLocation(pgm, "uDirLight1Vector")
    ngl.locations.uDirLight2Color = gl.getUniformLocation(pgm, "uDirLight2Color")
    ngl.locations.uDirLight2Vector = gl.getUniformLocation(pgm, "uDirLight2Vector")
  }

  ngl.buffers.cube = createBuffersForCube(gl, buffer_data_for_cube())

  gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.positions)
  gl.vertexAttribPointer(ngl.locations.aVertexPosition, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.normals)
  gl.vertexAttribPointer(ngl.locations.aVertexNormal, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ngl.buffers.cube.elements)
}

let state = world_setup()
let each_frame = (dt) => {
  state = world_step({ dt, state, keys: ngl.pressed_keys, zoomDelta: ngl.mouseWheelDeltaY })
  ngl.mouseWheelDeltaY = 0
  draw_frame({ dt, state, ngl, gl })
  requestAnimationFrame(each_frame)
}
requestAnimationFrame(each_frame)
