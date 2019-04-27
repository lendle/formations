import { PlaneAssignment, Formation, Plane, SlotData } from "./interfaces"
import lapwrapper from "./lapwrapper"
import * as d3 from "d3"

const slotPlane = (
  plane: Plane,
  formation: Formation,
  formationSlotIds: number[]
) => {
  const score = (formationSlotId: number, planeSlotId: number) => {
    const slot = formation.slots[formationSlotId]
    const { reverseBuildOrder } = slot
    const { jr } = plane.slots[planeSlotId]

    const slotJr = slot.offset.plus(slot.position).y

    return Math.abs(jr) * reverseBuildOrder * 100 - slotJr * jr
  }
  return lapwrapper(formationSlotIds, d3.range(plane.filledSlots), score).map(
    ([formationSlotId, planeSlotId]) => ({ formationSlotId, planeSlotId })
  )
}

export default function slotify(
  formation: Formation,
  planes: Plane[],
  planeAssignments: PlaneAssignment[]
): SlotData[] {
  return planes.flatMap((plane, planeId) => {
    const formationSlotIds = planeAssignments
      .filter(plane => plane.planeId === planeId)
      .map(({ formationSlotId }) => formationSlotId)

    const planeSlotAssignments = slotPlane(plane, formation, formationSlotIds)

    return planeSlotAssignments.map(({ formationSlotId, planeSlotId }) => ({
      formationSlotId,
      formationSlot: formation.slots[formationSlotId],
      planeId,
      plane,
      planeSlotId,
      planeSlot: plane.slots[planeSlotId]
    }))
  })
}
