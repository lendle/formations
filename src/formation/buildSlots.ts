import { Formation, Plane, SlotData } from "./interfaces"
import planeify from "./planeify"
import slotify from "./slotify"
import { rollup as d3Rollup } from "d3-array"

export default (formation: Formation, planes: Plane[]): SlotData[] => {
  const planeAssignments = planeify(formation, planes)
  const planeSlotAssignments = slotify(formation, planes, planeAssignments)

  const planeIdToSortedFormationSlotIds = d3Rollup(
    planeAssignments,
    pa =>
      pa.map(({ formationSlotId }) => formationSlotId).sort((a, b) => a - b),
    ({ planeId }) => planeId
  )

  const formationSlotIdToByPlaneSlotId = new Map(
    planes.flatMap((_, planeId, planes) => {
      const priorSlots = planes
        .slice(0, planeId)
        .reduce((acc, p) => acc + p.filledSlots, 0)
      return (planeIdToSortedFormationSlotIds.get(planeId) || []).map(
        (formationSlotId, i) => [formationSlotId, priorSlots + i]
      )
    })
  )

  return planeSlotAssignments.map(
    ({ formationSlotId, planeId, planeSlotId }) => ({
      formationSlotId,
      formation,
      formationSlot: formation.slots[formationSlotId],
      planeId,
      plane: planes[planeId],
      planeSlotId,
      byPlaneSlotId: formationSlotIdToByPlaneSlotId.get(formationSlotId)!
    })
  )
}
