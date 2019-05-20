import Polar from "./Polar"

export class Box {
  x0: number
  y0: number
  x1: number
  y1: number
  constructor(x0: number, y0: number, x1: number, y1: number) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }

  get cx(): number {
    return (this.x0 + this.x1) / 2
  }
  get cy(): number {
    return (this.y0 + this.y1) / 2
  }

  get width(): number {
    return this.x1 - this.x0
  }

  get height(): number {
    return this.y1 - this.y0
  }

  //since browser/d3 coordinates flip Y
  flipY(): Box {
    return new Box(this.x0, -this.y1, this.x1, -this.y0)
  }

  flipX(): Box {
    return new Box(-this.x1, this.y0, -this.x0, this.y1)
  }

  expand(p: Polar): Box {
    return new Box(
      Math.min(this.x0, p.x),
      Math.min(this.y0, p.y),
      Math.max(this.x1, p.x),
      Math.max(this.y1, p.y)
    )
  }

  translate(p: Polar): Box {
    return new Box(this.x0 + p.x, this.y0 + p.y, this.x1 + p.x, this.y1 + p.y)
  }

  union(b: Box): Box {
    return new Box(
      Math.min(this.x0, b.x0),
      Math.min(this.y0, b.y0),
      Math.max(this.x1, b.x1),
      Math.max(this.y1, b.y1)
    )
  }

  scale(s: number): Box {
    return new Box(this.x0 * s, this.y0 * s, this.x1 * s, this.y1 * s)
  }
}
