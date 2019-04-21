import AbstractSlotCollection from "../AbstractSlotCollection"
import { PlaneSlot, Plane } from "../interfaces"
import PlanePosition from "../PlanePosition"
import { PI } from "../../constants"

export default class PlaneImpl extends AbstractSlotCollection<PlaneSlot>
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
        return PI / 2
      case PlanePosition.LT:
        return (7 * PI) / 6
      case PlanePosition.RT:
        return (11 * PI) / 6
    }
  }

  protected computeSlots(): PlaneSlot[] {
    return []
  }
}
