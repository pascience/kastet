let rgb_for_color = {
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffff00,
}
let piece_dimension = [0.4, 0.8, 0.1]

function three_setup(parentElementSelector) {
  let renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.querySelector(parentElementSelector).appendChild(renderer.domElement)

  let scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 50)

  let pieces = {}
  {
    let cumulative_color_offset = 0
    let piece_element_geometry = new THREE.BoxGeometry(...piece_dimension);
    ["red" , "green", "blue", "yellow"].forEach((color_name, color_number) => {
      let material_for_this_color = new THREE.MeshBasicMaterial({ color: rgb_for_color[color_name] })

      pieces_for_color[color_name].forEach((piece_id, piece_number_for_this_color) => {
        let colored_piece_node = new THREE.Object3D()
        colored_piece_node.position.x = (cumulative_color_offset+piece_number_for_this_color)*piece_dimension[0]*2.5
        colored_piece_node.position.y = 0
        colored_piece_node.position.z = 0
        scene.add(colored_piece_node)

        let piece_model = puzzle_models[piece_id]

        for(let cell = 0; cell < piece_model.length; cell += 1) {
          let height = piece_model[cell]
          if(height < 1) {
            continue
          }
          for(let cur_height = 0; cur_height < height; cur_height += 1) {
            let element = new THREE.Mesh(piece_element_geometry, material_for_this_color)
            element.position.x = piece_dimension[0]*(cell % 2)
            element.position.y = piece_dimension[1]*Math.floor(cell / 2)
            element.position.z = piece_dimension[2]*cur_height
            colored_piece_node.add(element)
            pieces[color_name+piece_number_for_this_color] = colored_piece_node
          }
        }
      })
      cumulative_color_offset += number_of_pieces_for_color(color_name) + 0.5
    })
  }

  return {
    scene, camera, renderer,
    three_draw: () => { renderer.render(scene, camera) },
    pieces
  }
}

function three_update({ rdr: { camera, three_draw }, dt, state }) {
  {
    textbox.clear()
    let pos = state.camera.position.map(x => Math.floor(x*100)/100)
    textbox.println(`[${pos[0]},${pos[1]},${pos[2]}]`)
    textbox.println("move : directional keys")
    textbox.println("zoom : Z/S or mouse wheel")
    textbox.draw()
  }

  camera.position.x = state.camera.position[0]
  camera.position.y = state.camera.position[1]
  camera.position.z = state.camera.position[2]

  three_draw() 
}
