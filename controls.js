let controls = (() => {
  let rootElement = document.querySelector("#controls")
  let COLOR = 0, VECTOR = 1
  let values = {}

  function vectorToString(vector) {
    return `[${vector.map(x => ''+x).join(",")}]`
  }

  function addControl(controlType, controlName, initialValue, options={}) {
    values[controlName] = initialValue

    let visible = options.visible == null ? true : options.visible
    if(!visible) {
      return
    }

    let container = document.createElement("div")
    container.setAttribute("class", "control")
    {
      let name = document.createElement("div")
      name.setAttribute("class", "control__name")
      name.innerHTML = controlName
      container.appendChild(name)

      let value_text = document.createElement("div")
      value_text.setAttribute("class", "control__value")
      value_text.innerHTML = vectorToString(initialValue)
      container.appendChild(value_text)

      for(let component = 0; component < 3; component++) {
        let element = document.createElement("input")
        element.setAttribute("type", "range")
        element.setAttribute("min", "0")
        element.setAttribute("max", "1")
        element.setAttribute("step", "0.01")
        element.setAttribute("value", initialValue[component])
        element.setAttribute("class", "component")
        element.addEventListener("change", () => {
          values[controlName][component] = element.value
          value_text.innerHTML = vectorToString(initialValue)
        })
        container.appendChild(element)
      }
    }
    rootElement.appendChild(container)
  }

  function getValue(controlName) {
    return values[controlName]
  }

  function debug() {
    console.log(values)
  }

  return { getValue, addControl, COLOR, VECTOR, debug }
})()
controls.addControl(controls.COLOR, "uAmbientLightColor", [0.5, 0.5, 0.5], { visible: true })
controls.addControl(controls.COLOR, "uDirLight1Color", [0.5, 0.5, 0.75], { visible: true })
controls.addControl(controls.VECTOR, "uDirLight1Vector", [0.3, 1, 0], { visible: true })
controls.addControl(controls.COLOR, "uDirLight2Color", [0.2, 0.2, 0.05], { visible: true })
controls.addControl(controls.VECTOR, "uDirLight2Vector", [0, 0, 1], { visible: true })
