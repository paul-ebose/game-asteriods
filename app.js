/**@type {HTMLCanvasElement} */
const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

const FPS = 30
const SHIP_SIZE = 30
const SHIP_THRUST = 5
const TURN_SPEED = 180
const FRICTION = 0.7
const DEGREE = Math.PI/180

const ship = {
  x: cvs.width/2,
  y: cvs.height/2,
  r: SHIP_SIZE/2,
  a: 90 * DEGREE,
  rotation: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
  draw() {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = SHIP_SIZE/20
    ctx.beginPath()
    // ship nose
    ctx.moveTo(
      ship.x + (4/3 * ship.r) * Math.cos(ship.a),
      ship.y - (4/3 * ship.r) * Math.sin(ship.a),
    )
    // ship rear left
    ctx.lineTo(
      ship.x - ship.r * (2/3 * Math.cos(ship.a) + Math.sin(ship.a)),
      ship.y + ship.r * (2/3 * Math.sin(ship.a) - Math.cos(ship.a)),
    )
    // ship rear right
    ctx.lineTo(
      ship.x - ship.r * (2/3 * Math.cos(ship.a) - Math.sin(ship.a)),
      ship.y + ship.r * (2/3 * Math.sin(ship.a) + Math.cos(ship.a)),
    )
    ctx.closePath()
    ctx.stroke()
    // center dot, centroid
    ctx.fillStyle = '#16169e'
    ctx.fillRect(ship.x-2, ship.y-2, 4, 4)
  },
  design() {
    ctx.strokeStyle = '#16169e'
    ctx.beginPath()
    // ship nose
    ctx.moveTo(
      ship.x + ship.r * Math.cos(ship.a),
      ship.y - ship.r * Math.sin(ship.a),
    )
    // ship centroid
    ctx.lineTo(
      ship.x - ship.r * (0/3 * Math.cos(ship.a)),
      ship.y + ship.r * (0/3 * Math.sin(ship.a)),
    )
    ctx.stroke()
  },
  drawThruster() {
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = SHIP_SIZE/20
    ctx.beginPath()
    // ship left rear
    ctx.moveTo(
      ship.x - ship.r * (2/3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * (2/3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a)),
    )
    // ship rear centre
    ctx.lineTo(
      ship.x - ship.r * Math.cos(ship.a),
      ship.y + ship.r * Math.sin(ship.a),
    )
    // ship rear right
    ctx.lineTo(
      ship.x - ship.r * (2/3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * (2/3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a)),
    )
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  },
  update() {
    // rotate ship
    ship.a += ship.rotation
    // move ship
    ship.x += ship.thrust.x
    ship.y += ship.thrust.y
    // thrust ship
    if (ship.thrusting) {
      ship.thrust.x += Math.cos(ship.a) / FPS
      ship.thrust.y -= Math.sin(ship.a) / FPS
    } else {
      ship.thrust.x -= ship.thrust.x * FRICTION / FPS
      ship.thrust.y -= ship.thrust.y * FRICTION / FPS
    }
    // handle screen edges
    if (ship.x < 0 - ship.r)
      ship.x = cvs.width + ship.r
    else if (ship.x > cvs.width + ship.r)
      ship.x = 0 - ship.r

    if (ship.y < 0 - ship.r)
      ship.y = cvs.height + ship.r
    else if (ship.y > cvs.height + ship.r)
      ship.y = 0 - ship.r
  },
}

function handleKeyUp(/**@type {KeyboardEvent} */ ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      ship.rotation = 0
      break
    case 'ArrowUp':
      ship.thrusting = false
      break
    case 'ArrowRight':
      ship.rotation = 0
      break
    case 'ArrowDown':

      break
    default:
      break
  }
}

function handleKeyDown(/**@type {KeyboardEvent} */ ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      ship.rotation = TURN_SPEED * DEGREE / FPS
      break
    case 'ArrowUp':
      ship.thrusting = true
      break
    case 'ArrowRight':
      ship.rotation = -TURN_SPEED * DEGREE / FPS
      break
    case 'ArrowDown':

      break
    default:
      break
  }

}

function draw() {
  ctx.fillStyle = '#00090c'
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  ship.draw()
  ship.thrusting ? ship.drawThruster() : ship.design()
}

function update() {
  ship.update()
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

loop()
