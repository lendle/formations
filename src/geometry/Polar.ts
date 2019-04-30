import { PI, TAU } from "../constants"

// polar coordinate from origin (center of base)
export default class Polar {
  radius: number
  theta: number
  constructor(radius: number, theta: number) {
    this.radius = radius
    this.theta = Polar.unspin(theta)
  }

  toString() {
    return `(r${this.radius},∠${this.theta / TAU}τ)`
  }

  //https://math.stackexchange.com/questions/1365622/adding-two-polar-vectors
  plus(other: Polar) {
    const { radius: r1, theta: t1 } = this
    const { radius: r2, theta: t2 } = other
    return new Polar(
      Math.sqrt(r1 * r1 + r2 * r2 + 2 * r1 * r2 * Math.cos(t2 - t1)),
      t1 + Math.atan2(r2 * Math.sin(t2 - t1), r1 + r2 * Math.cos(t2 - t1))
    )
  }

  minus(other: Polar) {
    return this.plus(other.rotate(PI))
  }

  rotate(theta: number) {
    return new Polar(this.radius, this.theta + theta)
  }

  //flip coordinate over over
  flip(over: number) {
    return new Polar(this.radius, -this.theta - 2 * over)
  }

  // distance from other point
  distanceFrom(other: Polar) {
    return this.minus(other).radius
  }

  angleFrom(other: Polar) {
    return this.minus(other).theta
  }

  angleTo(other: Polar) {
    return other.minus(this).theta
  }

  scale(s: number) {
    return new Polar(this.radius * s, this.theta)
  }

  // d3 treats theta = 0 as up, but in high school, theta = 0 is right
  // also, d3 treats increasing theta as rotating clockwise, hs went counter clock wise
  // this maps a highschool polar angle to a d3 polar angle
  get d3theta() {
    return Polar.unspin(-this.theta + PI / 2)
  }

  get x() {
    return this.radius * Math.cos(this.theta)
  }

  //svg treats positive y as going down from top of page
  get y() {
    return -this.radius * Math.sin(this.theta)
  }

  // map theta back to [0, 2PI)
  static unspin(theta: number) {
    const t = Math.floor(theta / (2 * PI))
    return theta - t * 2 * PI
  }
}
