import {
  DEGREE,
  distanceBetweenPoints,
  FPS, ROID_JAG,
  ROID_START_SIZE,
  ROID_START_SPEED,
  ROID_VERTICES,
  SHOW_COLLISION_BOUND,
} from './constants.js'

export default class Asteroid {
  constructor(x, y) {
    this.x = x
    this.y = y
    // (x/y) velocity = random magnitude/speed * random direction
    this.xv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.yv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.r = ROID_START_SIZE / 2
    this.a = Math.random() * (360 * DEGREE)
    this.vertices = Math.floor((Math.random() * ROID_VERTICES) + ROID_VERTICES/2)
    this.offsets = []
    // offsets for the vertices
    for (let i = 0; i < this.vertices; i++)
      this.offsets = [ ...this.offsets, Math.random() * ROID_JAG + 1 - ROID_JAG]
  }

  static render(ctx, cvs, ship, roids) {
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
      // detect collisions [if,if,then]
      ship.blinkNumber === 0 &&
        distanceBetweenPoints(ship.x, ship.y, roid.x, roid.y) < ship.r + roid.r-10 &&
        ship.explode()
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
