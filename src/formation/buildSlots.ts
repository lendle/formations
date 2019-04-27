import { Formation, Plane, SlotData } from "./interfaces"
import planeify from "./planeify"
import slotify from "./slotify"

export default (formation: Formation, planes: Plane[]): SlotData[] => {
  const slots = slotify(formation, planes, planeify(formation, planes))
  console.log({
    slots: slots.map(({ formationSlotId, planeId, planeSlotId }) => ({
      formationSlotId,
      planeId,
      planeSlotId
    }))
  })
  return slots
}
