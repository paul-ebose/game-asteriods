import { DEGREE, FPS, TURN_SPEED, ROID_STARTING_NUM, ROID_START_SIZE } from './modules/constants.js'
import Ship from './modules/Ship.js'
import Asteroid from './modules/Asteroid.js'

/**@type {HTMLCanvasElement} */
const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

// set ship & asteroids
const ship = new Ship( cvs.width/2, cvs.height/2, 30)
let roids = []
createAsteriodBelt()

function createAsteriodBelt() {
  roids = []
  let x, y
  for (let i = 0; i < ROID_STARTING_NUM; i++) {
    do {
      x = Math.floor(Math.random() * cvs.width)
      y = Math.floor(Math.random() * cvs.height)
    } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ( ROID_START_SIZE * 2 + ship.r ))
    roids = [ ...roids, new Asteroid(x, y)]
  }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

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
  Asteroid.render(ctx, cvs, ship.size/20, roids)
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
