import Asteroid from './modules/Asteroid.js'
import { DEGREE, FPS, SHIP_TURN_SPEED , TEXT_FADE_TIME, FONT_SIZE} from './modules/constants.js'
import Ship from './modules/Ship.js'

/** @type {HTMLCanvasElement} */
const cvs = document.getElementById('gameCanvas')
const ctx = cvs.getContext('2d')

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

let level, ship, text, textAlpha
newGame()

function newGame() {
  level = 0
  ship = new Ship(cvs.width/2, cvs.height/2, ctx)
  newLevel()
}

function newLevel() {
  text = `Level ${level + 1}`
  textAlpha = 1
  Asteroid.createAsteriodBelt(cvs, ship, level)
}

function drawText() {
  if (textAlpha > 0) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`
    ctx.font = `small-caps ${FONT_SIZE}px Consolas`
    ctx.fillText(text, cvs.width / 2, cvs.height * 0.75)
    textAlpha -= (1 / TEXT_FADE_TIME / FPS)
  }
}

function resetShip() {
  ship.explodeTime--
  (ship.explodeTime === 0) && (
    ship = new Ship(cvs.width/2, cvs.height/2, ctx))
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
  Asteroid.render(ctx, cvs, ship, level)
  ship.isExploding && ship.drawExplosion()
  if (!ship.isExploding) {
    ship.handleBlinking()
    ship.blinkIsOn && ship.draw()
    ship.blinkIsOn && ship.isThrusting ? ship.drawThruster() : ship.design('#16169e')
  }
  drawText()
}

function update() {
  ship.isExploding ? resetShip() : ship.update(cvs)
  Asteroid.detectLaserHit(ship, level)
  if (Asteroid.gotoNextLevel) {
    level++
    newLevel()
    Asteroid.gotoNextLevel = false
  }
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

loop()
