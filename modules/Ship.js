import {
  DEGREE,
  FPS,
  FRICTION,
  LASER_MAX,
  LASER_SPEED,
  MAX_TRAVEL_DISTANCE,
  SHIP_BLINK_DURATION,
  SHIP_EXPLODE_DURATION,
  SHIP_INVISIBILTY_DURATION,
  SHOW_COLLISION_BOUND,
} from './constants.js'

export default class Ship {
  constructor(x, y, context, size = 30) {
    this.x = x
    this.y = y
    this.ctx = context
    this.size = size
    this.r = size/2
    this.a = 90 * DEGREE
    this.rotation = 0
    this.canShoot = true
    this.lasers = []
    this.blinkNumber= Math.ceil(SHIP_INVISIBILTY_DURATION / SHIP_BLINK_DURATION)
    this.blinkTime = Math.ceil(SHIP_BLINK_DURATION * FPS)
    this.blinkIsOn = this.blinkNumber % 2 === 0
    this.isThrusting = false
    this.thrust = {
      x: 0,
      y: 0,
    }
  }

  draw() {
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = this.size/20
    this.ctx.beginPath()
    // ship nose
    this.ctx.moveTo(
      this.x + (4/3 * this.r) * Math.cos(this.a),
      this.y - (4/3 * this.r) * Math.sin(this.a),
    )
    // ship rear left
    this.ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) + Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) - Math.cos(this.a)),
    )
    // ship rear right
    this.ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) - Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) + Math.cos(this.a)),
    )
    this.ctx.closePath()
    this.ctx.stroke()
    // center dot, centroid
    this.ctx.fillStyle = '#16169e'
    this.ctx.fillRect(this.x-2, this.y-2, 4, 4)
    // show boundary
    if (SHOW_COLLISION_BOUND) {
      this.ctx.strokeStyle = 'lime'
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.r, 0, 360 * DEGREE)
      this.ctx.stroke()
    }
    // draw lasers is any
    for (const laser of this.lasers) {
      if (laser.explodeTime === 0) {
        this.ctx.fillStyle = 'salmon'
        this.ctx.beginPath()
        this.ctx.arc(laser.x, laser.y, this.size/15, 0, 360 * DEGREE)
        this.ctx.fill()
      } else {
        this.ctx.fillStyle = 'orangered'
        this.ctx.beginPath()
        this.ctx.arc(laser.x, laser.y, this.r * 0.75, 0, 360 * DEGREE)
        this.ctx.fill()
        //
        this.ctx.fillStyle = 'coral'
        this.ctx.beginPath()
        this.ctx.arc(laser.x, laser.y, this.r * 0.5, 0, 360 * DEGREE)
        this.ctx.fill()
        //
        this.ctx.fillStyle = 'pink'
        this.ctx.beginPath()
        this.ctx.arc(laser.x, laser.y, this.r * 0.25, 0, 360 * DEGREE)
        this.ctx.fill()
      }
    }
  }

  drawThruster() {
    this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'yellow'
    this.ctx.lineWidth = this.size/12
    this.ctx.beginPath()
    // ship left rear
    this.ctx.moveTo(
      this.x - this.r * (2/3 * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) - 0.5 * Math.cos(this.a)),
    )
    // ship rear centre
    this.ctx.lineTo(
      this.x - this.r * Math.cos(this.a),
      this.y + this.r * Math.sin(this.a),
    )
    // ship rear right
    this.ctx.lineTo(
      this.x - this.r * (2/3 * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
      this.y + this.r * (2/3 * Math.sin(this.a) + 0.5 * Math.cos(this.a)),
    )
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()
  }

  drawExplosion() {
    this.ctx.fillStyle = 'darkred'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 1.7, 0, 360 * DEGREE)
    this.ctx.fill()
    //
    this.ctx.fillStyle = 'coral'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 1.4, 0, 360 * DEGREE)
    this.ctx.fill()
    //
    this.ctx.fillStyle = 'orange'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 1.1, 0, 360 * DEGREE)
    this.ctx.fill()
    //
    this.ctx.fillStyle = 'yellow'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 0.8, 0, 360 * DEGREE)
    this.ctx.fill()
    //
    this.ctx.fillStyle = 'white'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 0.5, 0, 360 * DEGREE)
    this.ctx.fill()
  }

  design(color) {
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    // ship nose
    this.ctx.moveTo(
      this.x + this.r * Math.cos(this.a),
      this.y - this.r * Math.sin(this.a),
    )
    // ship centroid
    this.ctx.lineTo(this.x, this.y)
    this.ctx.stroke()
  }

  explode() {
    this.explodeTime = Math.ceil(SHIP_EXPLODE_DURATION * FPS)
    this.isExploding = this.explodeTime > 0
  }

  handleBlinking() {
    if (this.blinkNumber > 0 ) {
      // reduce blink time
      this.blinkTime--
      // reduce blink num
      if (this.blinkTime === 0) {
        this.blinkTime = Math.ceil(SHIP_BLINK_DURATION * FPS)
        this.blinkNumber--
      }
    }
    this.blinkIsOn = this.blinkNumber % 2 === 0
  }

  shoot() {
    // create laser object
    if (this.canShoot && this.lasers.length < LASER_MAX) {
      const laser = {
        x: this.x + (4/3 * this.r) * Math.cos(this.a),
        y: this.y - (4/3 * this.r) * Math.sin(this.a),
        xv: LASER_SPEED * Math.cos(this.a) / FPS,
        yv: -LASER_SPEED * Math.sin(this.a) / FPS,
        distance: 0,
        explodeTime: 0,
      }
      this.lasers = [ ...this.lasers, laser]
    }
    // shoot once per keypress
    this.canShoot = false
  }

  update(cvs) {
    // handle lasers
    for (const laser of this.lasers) {
      // check distance travelled
      if(laser.distance > MAX_TRAVEL_DISTANCE * cvs.width) {
        // remove the laser
        this.lasers = this.lasers.filter(l => l.distance !== laser.distance)
        continue
      }
      // handle laser explosion
      if (laser.explodeTime > 0) {
        laser.explodeTime--
        if (laser.explodeTime === 0) {
          const idx = this.lasers.findIndex(l => l === laser)
          this.lasers.splice(idx, 1)
          continue
        }
      } else {
        // move laser
        laser.x += laser.xv
        laser.y += laser.yv
        // calc distance travelled
        laser.distance += Math.sqrt(Math.pow(laser.xv, 2), Math.pow(laser.yv, 2))
      }
      // handle screen edges
      if (laser.x < 0)
        laser.x = cvs.width
      else if (laser.x > cvs.width)
        laser.x = 0

      if (laser.y < 0)
        laser.y = cvs.height
      else if (laser.y > cvs.height)
        laser.y = 0
    }
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
