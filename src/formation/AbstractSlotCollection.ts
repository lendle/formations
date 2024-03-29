import { BaseSlot, SlotCollection } from "./interfaces"

export default abstract class AbstractSlotCollection<S extends BaseSlot>
  implements SlotCollection<S> {
  private _slots?: S[]

  protected abstract computeSlots(): S[]

  get slots(): S[] {
    if (!this._slots) {
      this._slots = this.computeSlots()
    }

    return this._slots
  }
}
