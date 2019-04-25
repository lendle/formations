import { PlaneAssignment, Formation, Plane, Slot } from "./interfaces"
import lapwrapper from "./lapwrapper"

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

  return lapwrapper(
    formationSlotIds,
    Array.from(new Array(plane.filledSlots).keys()),
    score
  ).map(([formationSlotId, planeSlotId]) => ({ formationSlotId, planeSlotId }))
}

export default function slotify(
  formation: Formation,
  planes: Plane[],
  planeAssignments: PlaneAssignment[]
): Slot[] {
  return planes.flatMap((plane, idx) => {
    const formationSlotIds = planeAssignments
      .filter(({ planeId }) => planeId === idx)
      .map(({ formationSlotId }) => formationSlotId)
    return slotPlane(plane, formation, formationSlotIds).map(p => ({
      planeId: idx,
      ...p
    }))
  })
}
