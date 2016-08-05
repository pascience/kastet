window.vertexShader = `
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  uniform vec3 uVertexColor;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec3 vLighting;

  mat4 inverse(mat4 m) {
    float
        a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
        a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
        a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
        a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    return mat4(
        a11 * b11 - a12 * b10 + a13 * b09,
        a02 * b10 - a01 * b11 - a03 * b09,
        a31 * b05 - a32 * b04 + a33 * b03,
        a22 * b04 - a21 * b05 - a23 * b03,
        a12 * b08 - a10 * b11 - a13 * b07,
        a00 * b11 - a02 * b08 + a03 * b07,
        a32 * b02 - a30 * b05 - a33 * b01,
        a20 * b05 - a22 * b02 + a23 * b01,
        a10 * b10 - a11 * b08 + a13 * b06,
        a01 * b08 - a00 * b10 - a03 * b06,
        a30 * b04 - a31 * b02 + a33 * b00,
        a21 * b02 - a20 * b04 - a23 * b00,
        a11 * b07 - a10 * b09 - a12 * b06,
        a00 * b09 - a01 * b07 + a02 * b06,
        a31 * b01 - a30 * b03 - a32 * b00,
        a20 * b03 - a21 * b01 + a22 * b00) / det;
  }
  mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

  void main() {
    mat4 mvMatrix = inverse(uViewMatrix) * uModelMatrix;
    gl_Position = uProjectionMatrix * mvMatrix * vec4(aVertexPosition, 1.0);

    mat4 normalMatrix = transpose(inverse(mvMatrix));
    
    highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);
    
    highp vec4 transformedNormal = normalMatrix * vec4(aVertexNormal, 1.0);
    
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = uVertexColor * (ambientLight + (directionalLightColor * directional));
  }
`
window.fragmentShader = `
  precision mediump float;

  varying vec3 vLighting;

  void main(void) {      
    gl_FragColor = vec4(vLighting, 1.0); 
  }
`

function draw_setup({ ngl, gl }) {
  ngl.buffers.cube = createBuffersForCube(gl, buffer_data_for_cube())

  gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.positions)
  gl.vertexAttribPointer(ngl.locations.aVertexPosition, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.normals)
  gl.vertexAttribPointer(ngl.locations.aVertexNormal, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ngl.buffers.cube.elements)
}

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
