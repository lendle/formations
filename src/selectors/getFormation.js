import { createSelector } from "reselect";
import { PlaneTypes, SlottingOptions } from "../actions";
import getSlotOptions, { getPlanesConfig } from "./getSlotOptions";
import Plane from "../formation/Plane";
import Formation from "../formation/Formation.ts";
import buildFormation from "../formation/buildFormation";

const countFilledSlots = filledPlanes => filledPlanes.reduce((s, {filledSlots}) => s+filledSlots, 0)

/**
 * takes planes with slots available and returns array {plane: (plane position), filledSlots: number of slots filled}
 * lead plane will always have at least `baseSize` slots filled
 * @param {{plane:String, slots:Number}[]} unfilledPlanes array of objects representing planes with slots left. 
 *                           should have properties plane (lead, lt, rt), slots (total slots in plane)
 * @param {*} slotsRemaining slots to put in unfilledPlanes
 * @param {*} baseSize if unfilledPlanes includes lead plane, at least `baseSize` should go in it
 * @param {{plane:String, filledSlots:Number}[]} filledPlanes array of planes already full, or partially full if slotsRemaining = 0
 */
const slotUnfilledPlanes = (unfilledPlanes, slotsRemaining, baseSize, filledPlanes = []) => {
    if (unfilledPlanes.lenth === 0) {
        return filledPlanes
    }

    const slotsPerPlane = slotsRemaining / unfilledPlanes.length

    // if spreading remaing slots evently doesn't put enough in the lead plane for the base, fill that now
    const lead = unfilledPlanes.find(({plane}) => plane === "lead")
    if (lead && baseSize > slotsPerPlane) {
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({plane}) => plane !== "lead"),
            slotsRemaining - baseSize,
            baseSize,
            [{plane: 'lead', filledSlots: baseSize}, ...filledPlanes]
        )  
    }


    //get planes with fewer total slots than slotsPerPlane and fill em up
    const littlePlanes = unfilledPlanes.filter(({slots}) => slots < slotsPerPlane)
        .map(({plane, slots}) => ({plane, filledSlots: slots}))

    if (littlePlanes.length) {
        const littlePlaneLabels = littlePlanes.map(({plane}) => plane)
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({plane}) => !littlePlaneLabels.includes(plane)),
            slotsRemaining - countFilledSlots(littlePlanes),
            baseSize,
            [...filledPlanes, ...littlePlanes]
        )
    }

    // if we've gotten this far, there is room for at least slotsPerPlane on each unfilledPlane
    const minSlotsPerPlane = Math.floor(slotsPerPlane)
    const extras = slotsRemaining % minSlotsPerPlane

    // if the lead plane is still in the mix, then always put one less on that plane
    if (extras > 0 && lead) {
        const filledLead = {plane: 'lead', filledSlots: minSlotsPerPlane}
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({plane}) => plane !== 'lead'),
            slotsRemaining - minSlotsPerPlane,
            baseSize, 
            [filledLead, ...filledPlanes]
        )
    }

    //okay now fill the rest. the first `extras` planes will get an extra
    const remainingFilled = unfilledPlanes.map(({plane}, i) => ({plane, filledSlots: minSlotsPerPlane + (extras > i? 1: 0)}))

    //phew
    return [...filledPlanes, ...remainingFilled]
}

const getBaseSize = state => state.formationConfig.baseSize

/**
 * @param {Number} baseSize 
 * @param {Object[]} planesConfig 
 * @param {Object} slotOptions 
 * 
 * @returns {{plane: String, filledSlots: Number}[]} array of plane & filledSlots
 */
const getPlaneSlots = (baseSize, planesConfig, slotOptions) => {
    //using getSlotOptions to compute actual slots
    const slots = slotOptions.slots

    const filledPlanes = planesConfig
    .filter(({type, slotting}) => type !== PlaneTypes.NONE && slotting === SlottingOptions.FILL)
    .map(({plane, slots}) => ({plane, filledSlots: slots}))

    const unfilledPlanes = planesConfig.filter(({type, slotting}) => type !== PlaneTypes.NONE && slotting !== SlottingOptions.FILL)

    return slotUnfilledPlanes(
        unfilledPlanes,
        slots - countFilledSlots(filledPlanes),
        baseSize,
        filledPlanes
        )
}

/**
 * 
 * @param {*} planesConfig 
 * @param {*} planeSlots 
 * @returns {Plane[]} 
 */
const getPlanes = (planesConfig, planeSlots) => {
    const planeSlotDict = planeSlots.reduce((obj, {plane, filledSlots}) => ({...obj, [plane]: filledSlots}), {})

    return planesConfig
        .filter(({type}) => type !== PlaneTypes.NONE)
        .map(({plane, type}) => new Plane(planeSlotDict[plane], plane, type))
}

const getPlaneSlotsSelector = createSelector([getBaseSize, getPlanesConfig, getSlotOptions], getPlaneSlots)

const getPlanesSelector = createSelector([getPlanesConfig, getPlaneSlotsSelector], getPlanes)

const getFormation = (slotOptions, baseSize, planes) => new Formation(buildFormation(slotOptions.slots, baseSize), planes)

export default createSelector([getSlotOptions, getBaseSize, getPlanesSelector], getFormation)