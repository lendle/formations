import { PlaneTypes, SlottingOptions } from "../actions";
import AbstractSlotCollection from "./AbstractSlotCollection";
import { SlotCollection, PlaneSlot, Plane } from "./interfaces";
import PlanePosition from "./PlanePosition";
import { PI } from "../constants";

type UnfilledPlane = {
    plane: PlanePosition
    slots: number
}

type FilledPlane = {
    plane: PlanePosition,
    filledSlots: number
}

type PlaneConfig = {
    plane: PlanePosition
    type: string
    slotting: string
    slots: number
}


const countFilledSlots = (filledPlanes: FilledPlane[]) => filledPlanes.reduce((s, { filledSlots }) => s + filledSlots, 0)

/**
 * 
 * @param unfilledPlanes array of objects representing planes with slots left. 
 *                       should have properties plane (lead, lt, rt), slots (total slots in plane)
 * @param slotsRemaining slots to put in unfilledPlanes
 * @param baseSize if unfilledPlanes includes lead plane, at least `baseSize` should go in it
 * @param filledPlanes array of planes already full, or partially full if slotsRemaining = 0
 */
const slotUnfilledPlanes = (unfilledPlanes: UnfilledPlane[],
    slotsRemaining: number, baseSize: number, filledPlanes: FilledPlane[]): FilledPlane[] => {
    if (unfilledPlanes.length === 0) {
        return filledPlanes
    }

    const slotsPerPlane = slotsRemaining / unfilledPlanes.length

    // if spreading remaing slots evently doesn't put enough in the lead plane for the base, fill that now
    const lead = unfilledPlanes.find(({ plane }) => plane === PlanePosition.LEAD)
    if (lead && baseSize > slotsPerPlane) {
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({ plane }) => plane !== PlanePosition.LEAD),
            slotsRemaining - baseSize,
            baseSize,
            [{ plane: PlanePosition.LEAD, filledSlots: baseSize }, ...filledPlanes]
        )
    }


    //get planes with fewer total slots than slotsPerPlane and fill em up
    const littlePlanes = unfilledPlanes.filter(({ slots }) => slots < slotsPerPlane)
        .map(({ plane, slots }) => ({ plane, filledSlots: slots }))

    if (littlePlanes.length) {
        const littlePlaneLabels = littlePlanes.map(({ plane }) => plane)
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({ plane }) => !littlePlaneLabels.includes(plane)),
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
        const filledLead = { plane: PlanePosition.LEAD, filledSlots: minSlotsPerPlane }
        return slotUnfilledPlanes(
            unfilledPlanes.filter(({ plane }) => plane !== PlanePosition.LEAD),
            slotsRemaining - minSlotsPerPlane,
            baseSize,
            [filledLead, ...filledPlanes]
        )
    }

    //okay now fill the rest. the first `extras` planes will get an extra
    const remainingFilled = unfilledPlanes.map(({ plane }, i) => ({ plane, filledSlots: minSlotsPerPlane + (extras > i ? 1 : 0) }))

    //phew
    return [...filledPlanes, ...remainingFilled]
}

/**
 * 
 * @param baseSize 
 * @param planesConfig 
 * @param slotOptions 
 */
const filledPlanes = (slots: number, baseSize: number, planesConfig: PlaneConfig[]): FilledPlane[] => {

    const filledPlanes = planesConfig
        .filter(({ type, slotting }) => type !== PlaneTypes.NONE && slotting === SlottingOptions.FILL)
        .map(({ plane, slots }) => ({ plane, filledSlots: slots }))

    const unfilledPlanes = planesConfig.filter(({ type, slotting }) => type !== PlaneTypes.NONE && slotting !== SlottingOptions.FILL)

    return slotUnfilledPlanes(
        unfilledPlanes,
        slots - countFilledSlots(filledPlanes),
        baseSize,
        filledPlanes
    )
}

class PlaneImpl extends AbstractSlotCollection<PlaneSlot> implements Plane {

    position: PlanePosition;
    filledSlots: number;

    constructor(position: PlanePosition, filledSlots: number) {
        super()
        this.position = position
        this.filledSlots = filledSlots
    }

    get allSlots(): PlaneSlot[] {
        return []
    };

    get theta() {
        switch (this.position) {
            case PlanePosition.LEAD:
                return PI / 2
            case PlanePosition.LT:
                return 7 * PI / 6
            case PlanePosition.RT:
                return 11 * PI / 6
        }
    }
}

export default (slots: number, baseSize: number, planesConfig: PlaneConfig[]) => 
    filledPlanes(slots, baseSize, planesConfig)
        .map(({plane, filledSlots}) => new PlaneImpl(plane, filledSlots))
