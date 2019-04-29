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
// export class Otter extends AbstractPlane {
//   /**
//    * jrOffset determines which slot is considered 0 up or down jump run
//    * 3 is the 1st diver closet do the pilot just inside the door
//    * increase to the 'centeral' slot closer to the tail, decrease to move to cockpit
//    */
//   private jrOffset = 1
//   protected computeSlots(): PlaneSlot[] {
//     const l = 6
//     const floaters = d3
//       .range(7)
//       .map(y => ({ x: -2, y: l - 0.5 - y, jr: -y + this.jrOffset + 8 }))
//     const inDoor = d3
//       .range(3)
//       .map(y => ({ x: -1, y: l - 3 - y, jr: -y + this.jrOffset + 1 }))
//     const inDoor2 = d3
//       .range(2)
//       .map(y => ({ x: 0, y: l - 3.5 - y, jr: -y + this.jrOffset + -2 }))
//     const divers = d3
//       .range(6)
//       .flatMap(y => [
//         { x: -0.5, y: -0.5 - y, jr: -2 * y + this.jrOffset - 5 },
//         { x: 0.5, y: -0.5 - y, jr: -2 * y + this.jrOffset - 4 }
//       ])
//     return [...floaters, ...inDoor, ...inDoor2, ...divers]
//   }
// }

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

/**
 *    x
 *   x x
 *   x x
 *   x x
 *   x x
 *   x x
 *   x x
 *   x x
 *  -----
 *   x x
 *   x x
 *   x x
 *  x x x
 *
 */
// export class Skyvan extends AbstractPlane {
//   /**
//    * jrOffset determines which slot is considered 0 up or down jump run
//    * 3 is the 1st diver closet do the pilot just inside the door
//    * increase to the 'centeral' slot closer to the tail, decrease to move to cockpit
//    */
//   private jrOffset = 1
//   protected computeSlots(): PlaneSlot[] {
//     const l = 6
//     const door = [
//       { x:}
//     ]
//     d3
//       .range(3)
//       .map(y => ({ x: -2, y: l - 0.5 - y, jr: -y + this.jrOffset + 8 }))
//     const inDoor = d3
//       .range(3)
//       .map(y => ({ x: -1, y: l - 3 - y, jr: -y + this.jrOffset + 1 }))
//     const inDoor2 = d3
//       .range(2)
//       .map(y => ({ x: 0, y: l - 3.5 - y, jr: -y + this.jrOffset + -2 }))
//     const divers = d3
//       .range(6)
//       .flatMap(y => [
//         { x: -0.5, y: -0.5 - y, jr: -2 * y + this.jrOffset - 5 },
//         { x: 0.5, y: -0.5 - y, jr: -2 * y + this.jrOffset - 4 }
//       ])
//     return [...floaters, ...inDoor, ...inDoor2, ...divers]
//   }
// }

// export const planeFactory = (
//   position: PlanePosition,
//   filledSlots: number,
//   type: PlaneType
// ): Plane => {
//   switch (type) {
//     case PlaneType.OTTER:
//       return new Otter(position, filledSlots)
//     case PlaneType.SKYVAN:
//       throw new Error("SKYVAN not implemented")
//     case PlaneType.NONE:
//       throw new Error("PlaneType is NONE")
//   }
// }
