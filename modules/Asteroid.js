import { DEGREE, FPS, ROID_JAG, ROID_START_SIZE, ROID_START_SPEED, ROID_VERTEX } from './constants.js'

export default class Asteroid {
  constructor(x, y) {
    this.x = x
    this.y = y
    // (x/y) velocity = random magnitude/speed * random direction
    this.xv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.yv = (Math.random() * ROID_START_SPEED / FPS) * (Math.random() < 0.5 ? 1 : -1)
    this.r = ROID_START_SIZE / 2
    this.a = Math.random() * (360 * DEGREE)
    this.vertices = Math.floor((Math.random() * ROID_VERTEX) + ROID_VERTEX/2)
    this.offsets = []
    // offsets for the vertices
    for (let i = 0; i < this.vertices; i++)
      this.offsets = [ ...this.offsets, Math.random() * ROID_JAG + 1 - ROID_JAG]
  }

  static render(ctx, cvs, lineWidth, roids) {
    ctx.strokeStyle = 'slategrey'
    ctx.lineWidth = lineWidth

    let x, y, r, a, vertices, offsets
    for (const roid of roids) {
      x = roid.x
      y = roid.y
      r = roid.r
      a = roid.a
      vertices = roid.vertices
      offsets = roid.offsets
      // draw path
      ctx.beginPath()
      ctx.moveTo(
        x + r * offsets[0] * Math.cos(a),
        y + r * offsets[0] * Math.sin(a),
      )
      // draw polygon
      for (let i = 1; i < vertices; i++)
        ctx.lineTo(
          x + r * offsets[i] * Math.cos(a + i * (360 * DEGREE ) / vertices),
          y + r * offsets[i] * Math.sin(a + i * (360 * DEGREE ) / vertices),
        )
      ctx.closePath()
      ctx.stroke()
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
