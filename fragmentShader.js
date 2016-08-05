window.fragmentSource = `
precision mediump float;

varying vec3 vLighting;

void main(void) {      
  gl_FragColor = vec4(vLighting, 1.0); 
}
`