import {
  PlaneAssignment,
  Formation,
  Plane,
  PlaneSlotAssignment
} from "./interfaces"
import lapwrapper, { combineScoreFuns } from "./lapwrapper"
import * as d3 from "d3"
import PlanePosition from "./PlanePosition"

const slotPlane = (
  plane: Plane,
  formation: Formation,
  formationSlotIds: number[]
) => {
  /**
   * if formationSlotId is a base slot, should return 0 for the right base slot and a big number everywher eelse
   * if formationSlotId is not a base slot, should return a big number if planeSlotId is a base slot
   * @param formationSlotId
   * @param planeSlotId
   */
  const baseScore = (formationSlotId: number, planeSlotId: number) => {
    if (plane.position === PlanePosition.LEAD) {
      if (formation.baseIds.includes(formationSlotId)) {
        //formationSlotId is a base slot

        //get which base slot it is
        const baseIdIndex = formation.baseIds.findIndex(
          id => id === formationSlotId
        )

        //0 score for that slot in plane, otherwise big
        return planeSlotId === plane.baseIds[baseIdIndex] ? 0 : 10000
      } else {
        //formationSlotId is not a base slot

        const baseSize = formation.baseIds.length

        if (plane.baseIds.slice(0, baseSize).includes(planeSlotId)) {
          //this plane slot should be in the base but isn't, give big score
          return 10000
        }
      }
    }
  }

  const specialSlotScore = (formationSlotId: number, planeSlotId: number) => {
    if (plane.hasVideo) {
      if (planeSlotId === plane.videoId) {
        return 100000
      }
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
    d3.range(plane.filledSlots + (plane.hasVideo ? 1 : 0)),
    plane.position === PlanePosition.LEAD
      ? combineScoreFuns(specialSlotScore, baseScore)(score)
      : combineScoreFuns(specialSlotScore)(score)
  ).map(([formationSlotId, planeSlotId]) => ({ formationSlotId, planeSlotId }))
}

export default function slotify(
  formation: Formation,
  planes: Plane[],
  planeAssignments: PlaneAssignment[]
): PlaneSlotAssignment[] {
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
