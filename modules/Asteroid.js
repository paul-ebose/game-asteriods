import {
  DEGREE,
  distanceBetweenPoints,
  FPS,
  LASER_EXPLODE_DURATION,
  ROID_JAG,
  ROID_SIZES,
  ROID_START_SIZE,
  ROID_START_SPEED,
  ROID_STARTING_NUM,
  ROID_VERTICES,
  SHOW_COLLISION_BOUND,
} from './constants.js'

let roids = []

export default class Asteroid {
  constructor(x, y, level, r = ROID_SIZES.lg) {
    this.x = x
    this.y = y
    this.r = r
    this.levelMultiplier = 1 + 0.1 * level
    this.a = Math.random() * (360 * DEGREE)
    // (x/y) velocity = random magnitude/speed * random direction
    this.xv = (Math.random() * ROID_START_SPEED * this.levelMultiplier / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.yv = (Math.random() * ROID_START_SPEED * this.levelMultiplier / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.vertices = Math.floor((Math.random() * ROID_VERTICES) + ROID_VERTICES/2)
    this.offsets = []
    // offsets for the vertices
    for (let i = 0; i < this.vertices; i++)
      this.offsets = [ ...this.offsets, Math.random() * ROID_JAG + 1 - ROID_JAG]
  }

  static gotoNextLevel = false

  static createAsteriodBelt(cvs, ship, level) {
    roids = []
    let x, y
    for (let i = 0; i < ROID_STARTING_NUM + level; i++) {
      do {
        x = Math.floor(Math.random() * cvs.width)
        y = Math.floor(Math.random() * cvs.height)
      } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ( ROID_START_SIZE * 2 + ship.r ))
      roids = [ ...roids, new Asteroid(x, y, level)]
    }
  }

  static destroyAsteriod(idx, lvl) {
    const x = roids[idx].x
    const y = roids[idx].y
    const r = roids[idx].r
    // split asteriod if needed
    if (r === ROID_SIZES.lg) {
      roids.push(new Asteroid(x, y, lvl, ROID_SIZES.md))
      roids.push(new Asteroid(x, y, lvl, ROID_SIZES.md))
    }
    else if (r === ROID_SIZES.md) {
      roids.push(new Asteroid(x, y, lvl, ROID_SIZES.sm))
      roids.push(new Asteroid(x, y, lvl, ROID_SIZES.sm))
    }
    // destroy/remove asteriod
    roids.splice(idx, 1)
    // goto new level
    if (roids.length === 0) {
      this.gotoNextLevel = true
    }
  }

  static detectLaserHit(ship, lvl) {
    for (let i = 0; i < roids.length; i++)
      for (const laser of ship.lasers)
        if ((laser.explodeTime === 0) && (distanceBetweenPoints(roids[i].x, roids[i].y, laser.x, laser.y) < roids[i].r)) {
          // destroy roid and start laser explosion
          laser.explodeTime = Math.ceil(LASER_EXPLODE_DURATION * FPS)
          this.destroyAsteriod(i, lvl)
          break
        }
  }

  static render(ctx, cvs, ship, lvl) {
    let vertices, offsets
    for (const roid of roids) {
      ctx.strokeStyle = 'slategrey'
      ctx.lineWidth = ship.size/20
      vertices = roid.vertices
      offsets = roid.offsets
      // draw path
      ctx.beginPath()
      ctx.moveTo(
        roid.x + roid.r * offsets[0] * Math.cos(roid.a),
        roid.y + roid.r * offsets[0] * Math.sin(roid.a),
      )
      // draw polygon
      for (let i = 1; i < vertices; i++)
        ctx.lineTo(
          roid.x + roid.r * offsets[i] * Math.cos(roid.a + i * (360 * DEGREE ) / vertices),
          roid.y + roid.r * offsets[i] * Math.sin(roid.a + i * (360 * DEGREE ) / vertices),
        )
      ctx.closePath()
      ctx.stroke()
      // show boundary
      if (SHOW_COLLISION_BOUND) {
        ctx.strokeStyle = 'lime'
        ctx.beginPath()
        ctx.arc(roid.x, roid.y, roid.r-10, 0, 360 * DEGREE)
        ctx.stroke()
      }
      // detect collisions
      if ((ship.blinkNumber === 0) && !ship.dead && (
        distanceBetweenPoints(ship.x, ship.y, roid.x, roid.y) < ship.r + roid.r-10)) {
          ship.explode()
          const idx = roids.findIndex(r => r === roid)
          this.destroyAsteriod(idx, lvl)
          break
      }
      // move asteroid
      roid.x += roid.xv
      roid.y += roid.yv
      // handle screen edges
      if (roid.x < 0 - roid.r)
        roid.x = cvs.width + roid.r
      else if (roid.x > cvs.width + roid.r)
        roid.x = 0 - roid.r

      if (roid.y < 0 - roid.r)
        roid.y = cvs.height + roid.r
      else if (roid.y > cvs.height + roid.r)
        roid.y = 0 - roid.r
    }
  }

}
