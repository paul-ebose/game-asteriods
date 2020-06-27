import {
  DEGREE,
  distanceBetweenPoints,
  FPS,
  ROID_JAG,
  ROID_SIZES,
  ROID_START_SIZE,
  ROID_START_SPEED,
  ROID_STARTING_NUM,
  ROID_VERTICES,
  SHOW_COLLISION_BOUND,
} from './constants.js'

export default class Asteroid {
  constructor(x, y, r = ROID_SIZES.lg) {
    this.x = x
    this.y = y
    this.r = r
    this.a = Math.random() * (360 * DEGREE)
    this.roids = []
    // (x/y) velocity = random magnitude/speed * random direction
    this.xv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.yv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.vertices = Math.floor((Math.random() * ROID_VERTICES) + ROID_VERTICES/2)
    this.offsets = []
    // offsets for the vertices
    for (let i = 0; i < this.vertices; i++)
      this.offsets = [ ...this.offsets, Math.random() * ROID_JAG + 1 - ROID_JAG]
  }

  static createAsteriodBelt(cvs, ship) {
    this.roids = []
    let x, y
    for (let i = 0; i < ROID_STARTING_NUM; i++) {
      do {
        x = Math.floor(Math.random() * cvs.width)
        y = Math.floor(Math.random() * cvs.height)
      } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ( ROID_START_SIZE * 2 + ship.r ))
      this.roids = [ ...this.roids, new Asteroid(x, y)]
    }
  }

  static destroyAsteriod(idx) {
    const x = this.roids[idx].x
    const y = this.roids[idx].y
    const r = this.roids[idx].r
    // split asteriod if needed
    if (r === ROID_SIZES.lg) {
      this.roids.push(new Asteroid(x, y, ROID_SIZES.md))
      this.roids.push(new Asteroid(x, y, ROID_SIZES.md))
    }
    else if (r === ROID_SIZES.md) {
      this.roids.push(new Asteroid(x, y, ROID_SIZES.sm))
      this.roids.push(new Asteroid(x, y, ROID_SIZES.sm))
    }
    // destroy/remove asteriod
    this.roids.splice(idx, 1)
  }

  static detectLaserHit(ship) {
    for (const roid of this.roids)
      for (const laser of ship.lasers)
        if (distanceBetweenPoints(roid.x, roid.y, laser.x, laser.y) < roid.r) {
          ship.lasers = ship.lasers.filter(l => l.distance !== laser.distance)
          const idx = this.roids.findIndex(r => r === roid)
          this.destroyAsteriod(idx)
          break
        }
  }

  static render(ctx, cvs, ship) {
    let vertices, offsets
    for (const roid of this.roids) {
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
      if ((ship.blinkNumber === 0) && (distanceBetweenPoints(ship.x, ship.y, roid.x, roid.y) < ship.r + roid.r-10)) {
        ship.explode()
        const idx = this.roids.findIndex(r => r === roid)
        this.destroyAsteriod(idx)
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
