import Polar from "../../geometry/Polar"

import { range } from "d3"
import { FormationSlot } from "../interfaces"

export default abstract class Component {
  slots: number
  slotNumOffset: number

  constructor(slots: number, slotNumOffset: number) {
    if (slots < 0) {
      throw new Error(`slots should be non-negative, was ${slots}`)
    }
    this.slots = slots
    this.slotNumOffset = slotNumOffset
  }

  checkSlot(slot: number) {
    if (slot < 0 || slot >= this.slots)
      throw new Error(`slot should be in [0, ${this.slots}), was ${slot}`)
  }

  slotData(slot: number): FormationSlot {
    this.checkSlot(slot)

    return {
      offset: this.position(),
      position: this.slotPosition(slot),
      dockAngle: this.dockAngle(),
      buildOrder: this.buildOrder(slot)
    }
  }

  allSlots(): FormationSlot[] {
    return range(this.slots).map(slot => this.slotData(slot))
  }

  //returns position of slot *relative to position of component*
  slotPosition(s: number, offset = false) {
    this.checkSlot(s)
    const pos = new Polar(
      this.radius(),
      this.rotation() - 2 * s * this.dockAngle()
    )
    return offset ? pos.plus(this.position()) : pos
  }

  //returns position of left hand of slot *relative to center of formation*
  dockPosition(s: number) {
    this.checkSlot(s)
    return this.slotPosition(s)
      .rotate(-this.dockAngle())
      .plus(this.position())
  }

  // return build order for last slot to build
  abstract maxBuildOrder(): number

  //should return build order for slot
  abstract buildOrder(slot: number): number

  //returns radius of this component
  abstract radius(): number

  //returns center of this component
  abstract position(): Polar

  //returns rotation in theta of where to place first slot
  abstract rotation(): number

  //returns angle between slot position and dock position, i.e. half of wingspan angle
  abstract dockAngle(): number
}
