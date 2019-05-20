import { Formation, Plane, PlaneAssignment } from "./interfaces"
import PlanePosition from "./PlanePosition"
import Polar from "../geometry/Polar"
import { PI } from "../constants"
import approxeq from "../util/approxeq"
import lapwrapper, { combineScoreFuns } from "./lapwrapper"
import { range } from "d3"

/**
 * Puts people in planes
 * @param formation
 * @param planes lead assumed to be first
 */
export default function planeify(
  formation: Formation,
  planes: Plane[]
): PlaneAssignment[] {
  if (planes[0].position !== PlanePosition.LEAD) {
    throw new Error("lead plane should be first")
  }
  const LEAD_ID = 0

  //slotted[planeId] = array of slot indexes for plane planeId
  const slotted = planes.map(() => [] as number[])

  // ### rule based slotting ###
  // base in lead f

  const baseScores = (slotId: number, planeId: number) => {
    if (formation.baseIds.includes(slotId)) {
      return planeId === LEAD_ID ? 0 : 1000
    }
  }

  //todo add superfloat

  // ### end rule based slotting ###

  //using linear assignment problem formulation

  const angleScore = (slotId: number, planeId: number) => {
    const slot = formation.slots[slotId]
    const plane = planes[planeId]
    const slotPosition = slot.position.plus(slot.offset)
    const diff = Polar.unspin(slotPosition.theta - plane.theta)

    //penalize if component is on other side of jumprun from plane
    //componentTheta is component angle rotated 90 right
    // if > pi, right side of jump run. if < pi, left side of jump run
    const componentTheta = Polar.unspin(slot.offset.theta - PI / 2)
    const componentPosition =
      approxeq(componentTheta, 0) || approxeq(componentTheta, PI)
        ? PlanePosition.LEAD
        : componentTheta > PI
        ? PlanePosition.RT
        : PlanePosition.LT

    const penalty =
      componentPosition === PlanePosition.LEAD ||
      plane.position === PlanePosition.LEAD ||
      componentPosition === plane.position
        ? 0
        : PI

    return Math.min(diff, 2 * PI - diff) + penalty
  }

  //   const distScore = (slotId: number, planeId: number) => {
  //     const slot = formation.allSlots[slotId]
  //     const plane = planes[planeId]
  //     return Math.abs(slot.position.plus(slot.offset).distanceFrom(new Polar(100, plane.theta)))
  //   }

  const unslotted = range(formation.slots.length)
  const planeArray = planes.flatMap((plane, planeId) =>
    (Array(plane.filledSlots) as number[]).fill(planeId)
  )

  const assignments = lapwrapper(
    unslotted,
    planeArray,
    combineScoreFuns(baseScores)(angleScore)
  )

  assignments.forEach(([slotId, planeId]) => slotted[planeId].push(slotId))

  return slotted.flatMap((slotIds, planeId) =>
    slotIds.map(slotId => ({ formationSlotId: slotId, planeId }))
  )
}
