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
  pressed_keys: {}
}
let canvas = document.getElementById("sketch")
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



let gl = canvas.getContext("webgl")
{ // WebGL setup
  gl.enable(gl.DEPTH_TEST)

  function createWebGLProgram (vertexSource, fragmentSource) {
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
    let vertexShader = createShader(vertexSource, gl.VERTEX_SHADER)
    let fragmentShader = createShader(fragmentSource, gl.FRAGMENT_SHADER)
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(program)
      throw `Could not link WebGL program.\n\n${info}`
    }
    return program
  }
  let pgm = createWebGLProgram(window.vertexShader, window.fragmentShader)
  gl.useProgram(pgm)

  ngl.locations.aVertexPosition = gl.getAttribLocation(pgm, "aVertexPosition")
  gl.enableVertexAttribArray(ngl.locations.aVertexPosition)
  ngl.locations.aVertexNormal = gl.getAttribLocation(pgm, "aVertexNormal")
  gl.enableVertexAttribArray(ngl.locations.aVertexNormal)

  ngl.locations.uVertexColor = gl.getUniformLocation(pgm, "uVertexColor")
  ngl.locations.uModelMatrix = gl.getUniformLocation(pgm, "uModelMatrix")
  ngl.locations.uProjectionMatrix = gl.getUniformLocation(pgm, "uProjectionMatrix")
  ngl.locations.uViewMatrix = gl.getUniformLocation(pgm, "uViewMatrix")  
}

draw_setup({ ngl, gl })
let state = world_setup()
let each_frame = (dt) => {
  state = world_step({ dt, state, keys: ngl.pressed_keys })
  draw_frame({ dt, state, ngl, gl })
  requestAnimationFrame(each_frame)
}
requestAnimationFrame(each_frame)
