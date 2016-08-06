let rdr = three_setup("#rendererContainer")
let state = world_setup()
let each_frame = (dt) => {
  state = world_step({ dt, state, keys: ngl.pressed_keys, zoomDelta: ngl.mouseWheelDeltaY })
  ngl.mouseWheelDeltaY = 0
  three_update({ rdr, dt, state })
  requestAnimationFrame(each_frame)
}
requestAnimationFrame(each_frame)
