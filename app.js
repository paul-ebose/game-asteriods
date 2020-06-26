import { DEGREE, FPS, TURN_SPEED } from './modules/constants.js'
import Ship from './modules/Ship.js'

/**@type {HTMLCanvasElement} */
const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

const ship = new Ship( cvs.width/2, cvs.height/2, 30)

function handleKeyUp(/**@type {KeyboardEvent} */ ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      ship.rotation = 0
      break
    case 'ArrowUp':
      ship.isThrusting = false
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
      ship.isThrusting = true
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
  ship.draw(ctx)
  ship.isThrusting ? ship.drawThruster(ctx) : ship.design(ctx)
}

function update() {
  ship.update(cvs)
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

loop()
