import AbstractSlotCollection from "./AbstractSlotCollection"
import { PlaneSlot, Plane } from "./interfaces"
import PlanePosition from "./PlanePosition"
import { TAU } from "../constants"
import * as d3 from "d3"
import { PlaneType } from "../store/types"

// abstract class AbstractPlane extends AbstractSlotCollection<PlaneSlot>
//   implements Plane {
//   position: PlanePosition
//   filledSlots: number

//   constructor(position: PlanePosition, filledSlots: number) {
//     super()
//     this.position = position
//     this.filledSlots = filledSlots
//   }

//   get theta() {
//     switch (this.position) {
//       case PlanePosition.LEAD:
//         return (3 * TAU) / 12
//       case PlanePosition.LT:
//         return (7 * TAU) / 12
//       case PlanePosition.RT:
//         return (11 * TAU) / 12
//     }
//   }
// }

export class PlaneImpl extends AbstractSlotCollection<PlaneSlot>
  implements Plane {
  position: PlanePosition
  filledSlots: number
  type: PlaneType

  constructor(position: PlanePosition, filledSlots: number, type: PlaneType) {
    super()
    this.position = position
    this.filledSlots = filledSlots
    this.type = type
  }

  protected computeSlots(): PlaneSlot[] {
    return d3
      .range(24)
      .map(x => ({ jr: x - 14 }))
      .reverse()
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

  get baseIds() {
    switch (this.type) {
      case PlaneType.OTTER:
        return [7, 8, 9, 10, 11, 4, 3, 2, 5, 12]
      case PlaneType.SKYVAN:
        return [3, 4, 5, 8, 7, 6, 0, 1, 9, 10]
      default:
        return d3.range(10)
    }
  }

  get videoId() {
    switch (this.type) {
      case PlaneType.OTTER:
        return 0
      case PlaneType.SKYVAN:
        return 2
      default:
        return 10
    }
  }

  get superFloatId() {
    switch (this.type) {
      case PlaneType.OTTER:
        return 1
      case PlaneType.SKYVAN:
        return 0
      default:
        return 11
    }
  }
}
