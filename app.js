import Asteroid from './modules/Asteroid.js'
import {
  DEGREE,
  distanceBetweenPoints,
  FPS,
  ROID_SIZES,
  ROID_STARTING_NUM,
  ROID_START_SIZE,
  SHIP_TURN_SPEED,
} from './modules/constants.js'
import Ship from './modules/Ship.js'

/** @type {HTMLCanvasElement} */
const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

// set ship & asteroids
let ship = new Ship(cvs.width/2, cvs.height/2, ctx)
let roids = []
createAsteriodBelt()

function resetShip() {
  ship.explodeTime--
  ship.explodeTime === 0 && (
    ship = new Ship(cvs.width/2, cvs.height/2, ctx))
}

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

function detectLaserHit() {
  for (let i = 0; i < roids.length; i++) {
    distanceBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r-10 &&
      destroyAsteriod(i)
    for (const laser of ship.lasers) {
      if (distanceBetweenPoints(roids[i].x, roids[i].y, laser.x, laser.y) < roids[i].r) {
        ship.lasers = ship.lasers.filter(l => l.distance !== laser.distance)
        destroyAsteriod(i)
        break
      }
    }
  }
}

function destroyAsteriod(idx) {
  const x = roids[idx].x
  const y = roids[idx].y
  const r = roids[idx].r
  // split asteriod if needed
  if (r === ROID_SIZES.lg) {
    roids.push(new Asteroid(x, y, ROID_SIZES.md))
    roids.push(new Asteroid(x, y, ROID_SIZES.md))
  }
  else if (r === ROID_SIZES.md) {
    roids.push(new Asteroid(x, y, ROID_SIZES.sm))
    roids.push(new Asteroid(x, y, ROID_SIZES.sm))
  }
  // destroy/remove asteriod
  roids.splice(idx, 1)
}

function handleKeyUp(/** @type {KeyboardEvent} */ ev) {
  switch (ev.code) {
    case 'ArrowLeft':
      ship.rotation = 0
      break
    case 'ArrowUp':
      ship.isThrusting = false
      break
    case 'ArrowRight':
      ship.rotation = 0
      break
    case 'Space':
      ship.canShoot = true
      break
    default:
      break
  }
}

function handleKeyDown(/** @type {KeyboardEvent} */ ev) {
  switch (ev.code) {
    case 'ArrowLeft':
      ship.rotation = SHIP_TURN_SPEED * DEGREE / FPS
      break
    case 'ArrowUp':
      ship.isThrusting = true
      break
    case 'ArrowRight':
      ship.rotation = -SHIP_TURN_SPEED * DEGREE / FPS
      break
    case 'Space':
      ship.shoot()
      break
    default:
      break
  }

}

function draw() {
  ctx.fillStyle = '#00090c'
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  Asteroid.render(ctx, cvs, ship, roids)
  ship.isExploding && ship.drawExplosion()
  if (!ship.isExploding) {
    ship.handleBlinking()
    ship.blinkIsOn && ship.draw()
    ship.blinkIsOn && ship.isThrusting ? ship.drawThruster() : ship.design('#16169e')
  }
}

function update() {
  ship.isExploding ? resetShip() : ship.update(cvs)
  detectLaserHit()
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

loop()
