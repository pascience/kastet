let ngl = {
  buffers: {},
  locations: {
    position: null,
    colorAttribute: null,
    colorUniform: null,
    resolution: null,
    texture: null,
    model: null,
    projection: null,
    view: null,
  },
  width: window.innerWidth,
  height: window.innerHeight,
  pressed_keys: {}
}
window.addEventListener("resize", () => {
  ngl.width = window.innerWidth
  ngl.height = window.innerHeight
})
window.addEventListener("keydown", function(event) {
  if(! event.repeat) {
    ngl.pressed_keys[event.key] = true
  }
}, true)
window.addEventListener("keyup", function(event) {
  delete ngl.pressed_keys[event.key]
}, true)

let gl = document.getElementById("sketch").getContext("webgl")
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

  ngl.locations.position = gl.getAttribLocation(pgm, "position")
  // ngl.locations.colorAttribute = gl.getAttribLocation(pgm, "color")
  ngl.locations.colorUniform = gl.getUniformLocation(pgm, "color")
  // ngl.locations.resolution = gl.getUniformLocation(pgm, "resolution")
  // ngl.locations.texture = gl.getUniformLocation(pgm, "texture")
  ngl.locations.model = gl.getUniformLocation(pgm, "model")
  ngl.locations.projection = gl.getUniformLocation(pgm, "projection")
  ngl.locations.view = gl.getUniformLocation(pgm, "view")  
}

draw_setup({ ngl, gl })
let state = world_setup()
let each_frame = (dt) => {
  state = world_step({ dt, state, keys: ngl.pressed_keys })
  draw_frame({ dt, state, ngl, gl })
  requestAnimationFrame(each_frame)
}
requestAnimationFrame(each_frame)
