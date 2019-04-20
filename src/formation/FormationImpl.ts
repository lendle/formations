import Base from "./components/Base";
import Component from "./components/Component";
import AbstractSlotCollection from "./AbstractSlotCollection";
import { FormationSlot, Formation } from "./interfaces";

export default class FormationImpl extends AbstractSlotCollection<FormationSlot> implements Formation {
  
  components: Component[];
  constructor(components: Component[]) {
    super()
    this.components = components
  }

  protected computeSlots(): FormationSlot[] {
    return this.components.flatMap(c => c.allSlots())
  }

  get baseIds(): number[] {
    return this.components.find(c => c instanceof Base)!
      .allSlots().map(s => s.id)
  }

}