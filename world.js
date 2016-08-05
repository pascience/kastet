function world_setup() {
  return {
    t: 0,
    frame: 0
  }
}

function world_step({ dt, state: { t, frame } }) {
  return {
    t: t+dt,
    frame: frame+1
  }
}
