function setup() {
  return {
    t: 0,
    frame: 0
  }
}

function step({ dt, state: { t, frame } }) {
  return {
    t: t+dt,
    frame: frame+1
  }
}
