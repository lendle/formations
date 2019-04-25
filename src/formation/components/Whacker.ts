import Component from "./Component"
import Round, { PRRD } from "./Round"
import Polar from "../../geometry/Polar"

interface Dock {
  c: Component
  s: number
}

export default class Whacker extends Component {
  dock: Dock
  hand: string
  private _prrd: PRRD | undefined

  /*
  slots - 
  dock - { component, slot } this whacker is docked on
  hand - docked with 'left' or 'right'
 
  modeled as part of a pod (Round docked on one person) with slots * 2 + 1 slots
  */
  constructor(slots: number, slotNumOffset: number, dock: Dock, hand: string) {
    super(slots, slotNumOffset)
    this.dock = dock

    if (hand !== "left" && hand !== "right")
      throw new Error("Hand should be 'left' or 'right'")
    this.hand = hand
  }

  parents() {
    return [this.dock.c]
  }

  //left hand dock position of the imaginary pod
  _left() {
    const { c, s } = this.dock
    return this.hand === "left"
      ? c.dockPosition(s)
      : c
          .slotPosition(s)
          .rotate(-3 * c.dockAngle()) //move 1.5 slots to the left
          .plus(c.position())
  }

  //right hand dock position of the imaginary pod
  _right() {
    const { c, s } = this.dock
    return this.hand === "left"
      ? c
          .slotPosition(s)
          .rotate(c.dockAngle()) //move half a slot to the right
          .plus(c.position())
      : c.dockPosition(s)
  }

  get prrd() {
    if (!this._prrd) {
      const psuedoSlots = this.slots * 2 + 1

      this._prrd = Round._positionRadiusRotationDockAngle(
        this._left(),
        this._right(),
        psuedoSlots
      )

      if (this.hand === "left") {
        const invisibleSlots = psuedoSlots - this.slots
        const { rotation, dockAngle } = this._prrd
        const fixedRotation = Polar.unspin(
          rotation - invisibleSlots * 2 * dockAngle
        ) //rotate two slots to the right
        this._prrd.rotation = fixedRotation
      }
    }
    return this._prrd
  }

  maxBuildOrder() {
    return this.slots
  }

  buildOrder(slot: number) {
    this.checkSlot(slot)
    return this.hand === "left" ? this.slots - slot : slot + 1
  }

  position() {
    return this.prrd.position
  }

  radius() {
    return this.prrd.radius
  }

  rotation() {
    return this.prrd.rotation
  }

  dockAngle() {
    return this.prrd.dockAngle
  }
}
