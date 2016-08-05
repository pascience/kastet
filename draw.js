window.vertexShader = `
  attribute vec3 position;
  attribute vec4 color;

  uniform mat4 model;
  uniform mat4 projection;
  uniform mat4 view;

  varying vec4 vColor;

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

  void main() {
    vColor = color;
    gl_Position = projection * inverse(view) * model * vec4(position, 1.0);
  }
`
window.fragmentShader = `
  precision mediump float;

  varying vec4 vColor;

  void main(void) {      
    gl_FragColor = vColor; 
  }
`
function draw({ dt, state: { frame }, ngl, gl }) {
  {
    let model = multiplyArrayOfMatrices([
      translateMatrix(0, 0, -2),
      // rotateXMatrix(0.5 * Math.sin(frame * 0.1)),
      rotateYMatrix(frame*0.03),
      scaleMatrix(0.5, 0.5, 0.5)
    ])
    let projection = perspectiveMatrix(70*Math.PI/180, ngl.width/ngl.height, 1, 10)
    let view = multiplyArrayOfMatrices([
      translateMatrix(0, 1.5, 1),
      rotateXMatrix(0.5),
      // scaleMatrix(1, 1, 1), // last arg = zoom, if the looked-at point is the origin
    ])
    gl.uniformMatrix4fv(ngl.locations.model, false, new Float32Array(model))
    gl.uniformMatrix4fv(ngl.locations.projection, false, new Float32Array(projection))
    gl.uniformMatrix4fv(ngl.locations.view, false, new Float32Array(view))
  }

  { // draw the cube
    gl.enableVertexAttribArray(ngl.locations.position)
    gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.positions)
    gl.vertexAttribPointer(ngl.locations.position, 3, gl.FLOAT, false, 0, 0)
    
    gl.enableVertexAttribArray(ngl.locations.color)
    gl.bindBuffer(gl.ARRAY_BUFFER, ngl.buffers.cube.colors)
    gl.vertexAttribPointer(ngl.locations.color, 4, gl.FLOAT, false, 0, 0)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ngl.buffers.cube.elements)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
  }
}
