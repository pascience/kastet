let textbox = (() => {
  let element = document.querySelector("#textbox")
  let text = ""
  function draw() {
    element.innerHTML = text
  }
  function clear() {
    text = ""
  }
  function println(txt) {
    text += txt + "<br>"
  }
  return { clear, println, draw }
})()
