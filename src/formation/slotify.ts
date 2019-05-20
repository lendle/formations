import {
  PlaneAssignment,
  Formation,
  Plane,
  PlaenSlotAssignment
} from "./interfaces"
import lapwrapper, { combineScoreFuns } from "./lapwrapper"
import * as d3 from "d3"
import PlanePosition from "./PlanePosition"

const slotPlane = (
  plane: Plane,
  formation: Formation,
  formationSlotIds: number[]
) => {
  const baseScore = (formationSlotId: number, planeSlotId: number) => {
    if (plane.position === PlanePosition.LEAD) {
      const baseIdIndex = formation.baseIds.findIndex(
        id => id === formationSlotId
      )
      return planeSlotId === plane.baseIds[baseIdIndex] //if baseIdIndex is undefined, this will be falsy
        ? 0
        : 10000
    }
  }

  const score = (formationSlotId: number, planeSlotId: number) => {
    const slot = formation.slots[formationSlotId]
    const { reverseBuildOrder } = slot
    const { jr } = plane.slots[planeSlotId]

    const slotJr = slot.offset.plus(slot.position).y

    return Math.abs(jr) * reverseBuildOrder * 100 - slotJr * jr + 1000
  }

  return lapwrapper(
    formationSlotIds,
    d3.range(plane.filledSlots),
    plane.position === PlanePosition.LEAD
      ? combineScoreFuns(baseScore)(score)
      : score
  ).map(([formationSlotId, planeSlotId]) => ({ formationSlotId, planeSlotId }))
}

export default function slotify(
  formation: Formation,
  planes: Plane[],
  planeAssignments: PlaneAssignment[]
): PlaenSlotAssignment[] {
  return planes.flatMap((plane, planeId) => {
    const formationSlotIds = planeAssignments
      .filter(plane => plane.planeId === planeId)
      .map(({ formationSlotId }) => formationSlotId)

    const planeSlotAssignments = slotPlane(plane, formation, formationSlotIds)

    return planeSlotAssignments.map(({ formationSlotId, planeSlotId }) => ({
      formationSlotId,
      planeId,
      planeSlotId
    }))
  })
}
