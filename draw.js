window.vertexShader = `
  attribute vec3 position;
  attribute vec4 color;

  uniform mat4 model;
  uniform mat4 projection;
  uniform mat4 view;

  varying vec4 vColor;

  void main() {
    vColor = color;
    gl_Position = view * projection * model * vec4(position, 1.0);
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
      rotateXMatrix(0.5 * Math.sin(frame * 0.1)),
      rotateYMatrix(frame*0.03),
      scaleMatrix(0.5, 0.5, 0.5)
    ])
    let projection = perspectiveMatrix(70*Math.PI/180, ngl.width/ngl.height, 1, 10)
    let view = identityMatrix()
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
