import _ from 'lodash'
import { Formation, Plane } from "./interfaces";
import PlanePosition from './PlanePosition';
import Polar from '../geometry/Polar';
import { PI } from '../constants';
import approxeq from '../util/approxeq';
import lap from './lap';


/**
 * Puts people in planes
 * @param formation 
 * @param planes lead assumed to be first
 */
export default function planeify(formation: Formation, planes: Plane[]): { formationSlotId: number, planeId: number }[] {
    if (planes[0].position !== PlanePosition.LEAD) {
        throw new Error("lead plane should be first")
    }
    

    //slotted[planeId] = array of slot indexes for plane planeId
    const slotted = planes.map(() => [] as number[])

    // ### rule based slotting ###
    // base in lead f

    slotted[0].push(...formation.baseIds)

    //todo add superfloat

    // ### end rule based slotting ###

    //using linear assignment problem formulation

    const unslotted = Array.from(formation.slots.keys())
        .filter(formationSlotId => ! slotted.flat().includes(formationSlotId))

    // planeArray is an array of planeIds, repeated for the number of slots to fill in that plane
    const planeArray = planes.flatMap((plane, planeId) => {
        const remainigToFill = plane.filledSlots - slotted[planeId].length
        return (Array(remainigToFill) as number[]).fill(planeId)
    })

    if (planeArray.length !== unslotted.length) {
        throw new Error("planeArray and unslotted have diff lenghts")
    }

    const angleScore = (slotId: number, planeId: number) => {
        const slot = formation.slots[slotId]
        const plane = planes[planeId]
        const slotPosition = slot.position.plus(slot.offset)
        const diff = Polar.unspin(slotPosition.theta - plane.theta)

        //penalize if component is on other side of jumprun from plane
        //componentTheta is component angle rotated 90 right
        // if > pi, right side of jump run. if < pi, left side of jump run
        const componentTheta = Polar.unspin(slot.offset.theta - PI / 2)
        const componentPosition = approxeq(componentTheta, 0) || approxeq(componentTheta, PI) ?
            PlanePosition.LEAD : (componentTheta > PI) ? PlanePosition.RT : PlanePosition.LT

        const penalty = (componentPosition === PlanePosition.LEAD ||
            plane.position === PlanePosition.LEAD ||
            componentPosition === plane.position) ? 0 : PI

        return Math.min(diff, 2 * PI - diff) + penalty
    }

    //   const distScore = (slotId: number, planeId: number) => {
    //     const slot = formation.allSlots[slotId]
    //     const plane = planes[planeId]
    //     return Math.abs(slot.position.plus(slot.offset).distanceFrom(new Polar(100, plane.theta)))
    //   }


    //takes a scoreFun that takes a slotId and planeId, 
    //and converts it to a function that takes i, j for i, j in [0, unslotted.length)
    //for use with lap()
    const cost = (scoreFun: (slotId: number, planeId: number) => number) => {
        const memo = new Map<string, number>()
        return (i: number, j: number): number => {
            const key = `${i}.${j}`
            if (!memo.has(key)) {
                const slotId = unslotted[i]
                const planeId = planeArray[j]
                memo.set(key, scoreFun(slotId, planeId))
            }
            return memo.get(key)!
        }
    }

    const assignments = lap(unslotted.length, cost(angleScore)).row

    assignments.forEach((p, i) => {
        const planeId = planeArray[p]
        const slotId = unslotted[i]
        slotted[planeId].push(slotId)
    })

    return slotted.flatMap((slotIds, planeId) => 
        slotIds.map(slotId => ({ formationSlotId: slotId, planeId }))
    )
}


