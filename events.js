let ngl = {
  pressed_keys: {},
  mouseWheelDeltaY: 0,
}
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
