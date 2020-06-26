import { DEGREE, FPS, FRICTION } from './constants.js'

export default class Ship {
  constructor(x, y, size) {
    this.x = x
    this.y = y
    this.size = size
    this.r = size/2
    this.a = 90 * DEGREE
    this.rotation = 0
    this.isThrusting = false
    this.thrust = {
      x: 0,
      y: 0,
    }
  }

  draw(ctx) {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = this.size/20
    ctx.beginPath()
    // ship nose
    ctx.moveTo(
      this.x + (4/3 * this.r) * Math.cos(this.a),
      this.y - (4/3 * this.r) * Math.sin(this.a),
    )
    // ship rear left
    ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) + Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) - Math.cos(this.a)),
    )
    // ship rear right
    ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) - Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) + Math.cos(this.a)),
    )
    ctx.closePath()
    ctx.stroke()
    // center dot, centroid
    ctx.fillStyle = '#16169e'
    ctx.fillRect(this.x-2, this.y-2, 4, 4)
  }

  design(ctx) {
    ctx.strokeStyle = '#16169e'
    ctx.beginPath()
    // ship nose
    ctx.moveTo(
      this.x + this.r * Math.cos(this.a),
      this.y - this.r * Math.sin(this.a),
    )
    // ship centroid
    ctx.lineTo(
      this.x - this.r * (0/3 * Math.cos(this.a)),
      this.y + this.r * (0/3 * Math.sin(this.a)),
    )
    ctx.stroke()
  }

  drawThruster(ctx) {
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = this.size/12
    ctx.beginPath()
    // ship left rear
    ctx.moveTo(
      this.x - this.r * (2/3 * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) - 0.5 * Math.cos(this.a)),
    )
    // ship rear centre
    ctx.lineTo(
      this.x - this.r * Math.cos(this.a),
      this.y + this.r * Math.sin(this.a),
    )
    // ship rear right
    ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) + 0.5 * Math.cos(this.a)),
    )
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  update(cvs) {
    // rotate ship
    this.a += this.rotation
    // move ship
    this.x += this.thrust.x
    this.y += this.thrust.y
    // thrust ship
    if (this.isThrusting) {
      this.thrust.x += Math.cos(this.a) / FPS
      this.thrust.y -= Math.sin(this.a) / FPS
    } else {
      this.thrust.x -= this.thrust.x * FRICTION / FPS
      this.thrust.y -= this.thrust.y * FRICTION / FPS
    }
    // handle screen edges
    if (this.x < 0 - this.r)
      this.x = cvs.width + this.r
    else if (this.x > cvs.width + this.r)
      this.x = 0 - this.r

    if (this.y < 0 - this.r)
      this.y = cvs.height + this.r
    else if (this.y > cvs.height + this.r)
      this.y = 0 - this.r
  }

}
