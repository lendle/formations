import AbstractSlotCollection from "./AbstractSlotCollection"
import { PlaneSlot, Plane } from "./interfaces"
import PlanePosition from "./PlanePosition"
import { TAU } from "../constants"
import * as d3 from "d3"
import { PlaneType } from "../store/types"

abstract class AbstractPlane extends AbstractSlotCollection<PlaneSlot>
  implements Plane {
  position: PlanePosition
  filledSlots: number

  constructor(position: PlanePosition, filledSlots: number) {
    super()
    this.position = position
    this.filledSlots = filledSlots
  }

  get theta() {
    switch (this.position) {
      case PlanePosition.LEAD:
        return (3 * TAU) / 12
      case PlanePosition.LT:
        return (7 * TAU) / 12
      case PlanePosition.RT:
        return (11 * TAU) / 12
    }
  }
}

/**
 *     x x
 *     x x
 *     x x
 *     x x
 *     x x
 *  x  x x
 *  x
 *  x x x
 *  x x x
 *  x x
 *  x
 *  x
 */
export class Otter extends AbstractPlane {
  protected computeSlots(): PlaneSlot[] {
    const l = 6
    const floaters = d3.range(7).map(y => ({ x: -2, y: l - 0.5 - y, jr: -1 }))
    const inDoor = d3.range(3).map(y => ({ x: -1, y: l - 3 - y, jr: 0 }))
    const inDoor2 = d3.range(2).map(y => ({ x: 0, y: l - 3.5 - y, jr: 0 }))
    const divers = d3
      .range(5)
      .flatMap(y => [
        { x: -0.5, y: -0.5 - y, jr: y + 1 },
        { x: 0.5, y: -0.5 - y, jr: y + 1 }
      ])
    return [...floaters, ...inDoor, ...inDoor2, ...divers]
  }
}

export const planeFactory = (
  position: PlanePosition,
  filledSlots: number,
  type: PlaneType
): Plane => {
  switch (type) {
    case PlaneType.OTTER:
      return new Otter(position, filledSlots)
    case PlaneType.SKYVAN:
      throw new Error("SKYVAN not implemented")
    case PlaneType.NONE:
      throw new Error("PLaneType is NONE")
  }
}
