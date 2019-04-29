import { PlaneState, PlaneType, Slotting } from "../store/types"
import { Plane } from "./interfaces"
import PlanePosition from "./PlanePosition"
import { PlaneImpl } from "./planes"

type FilledPlane = {
  position: PlanePosition;
  filledSlots: number;
}

const countFilledSlots = (filledPlanes: FilledPlane[]) =>
  filledPlanes.reduce((s, { filledSlots }) => s + filledSlots, 0)

/**
 *
 * @param unfilledPlanes array of objects representing planes with slots left.
 *                       should have properties plane (lead, lt, rt), slots (total slots in plane)
 * @param slotsRemaining slots to put in unfilledPlanes
 * @param baseSize if unfilledPlanes includes lead plane, at least `baseSize` should go in it
 * @param filledPlanes array of planes already full, or partially full if slotsRemaining = 0
 */
const slotUnfilledPlanes = (
  unfilledPlanes: PlaneState[],
  slotsRemaining: number,
  baseSize: number,
  filledPlanes: FilledPlane[]
): FilledPlane[] => {
  if (unfilledPlanes.length === 0) {
    return filledPlanes
  }

  const slotsPerPlane = slotsRemaining / unfilledPlanes.length

  // if spreading remaing slots evently doesn't put enough in the lead plane for the base, fill that now
  const lead = unfilledPlanes.find(
    ({ position }) => position === PlanePosition.LEAD
  )
  if (lead && baseSize > slotsPerPlane) {
    return slotUnfilledPlanes(
      unfilledPlanes.filter(({ position }) => position !== PlanePosition.LEAD),
      slotsRemaining - baseSize,
      baseSize,
      [{ position: PlanePosition.LEAD, filledSlots: baseSize }, ...filledPlanes]
    )
  }

  //get planes with fewer total slots than slotsPerPlane and fill em up
  const littlePlanes = unfilledPlanes
    .filter(({ slots }) => slots < slotsPerPlane)
    .map(({ position, slots }) => ({ position, filledSlots: slots }))

  if (littlePlanes.length) {
    const littlePlaneLabels = littlePlanes.map(({ position }) => position)
    return slotUnfilledPlanes(
      unfilledPlanes.filter(
        ({ position }) => !littlePlaneLabels.includes(position)
      ),
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
    const filledLead = {
      position: PlanePosition.LEAD,
      filledSlots: minSlotsPerPlane
    }
    return slotUnfilledPlanes(
      unfilledPlanes.filter(({ position }) => position !== PlanePosition.LEAD),
      slotsRemaining - minSlotsPerPlane,
      baseSize,
      [filledLead, ...filledPlanes]
    )
  }

  //okay now fill the rest. the first `extras` planes will get an extra
  const remainingFilled = unfilledPlanes.map(({ position }, i) => ({
    position,
    filledSlots: minSlotsPerPlane + (extras > i ? 1 : 0)
  }))

  //phew
  return [...filledPlanes, ...remainingFilled]
}

/**
 *
 * @param baseSize
 * @param planesConfig
 * @param slotOptions
 */
const filledPlanes = (
  slots: number,
  baseSize: number,
  planesConfig: PlaneState[]
): FilledPlane[] => {
  const filledPlanes = planesConfig
    .filter(
      ({ type, slotting }) =>
        type !== PlaneType.NONE && slotting === Slotting.FILL
    )
    .map(({ position, slots }) => ({ position, filledSlots: slots }))

  const unfilledPlanes = planesConfig.filter(
    ({ type, slotting }) =>
      type !== PlaneType.NONE && slotting !== Slotting.FILL
  )

  return slotUnfilledPlanes(
    unfilledPlanes,
    slots - countFilledSlots(filledPlanes),
    baseSize,
    filledPlanes
  )
}

export default (
  slots: number,
  baseSize: number,
  planesConfig: PlaneState[]
): Plane[] => {
  const slotsMap = new Map(
    filledPlanes(slots, baseSize, planesConfig).map(
      ({ position, filledSlots }) => [position, filledSlots]
    )
  )

  return planesConfig.map(
    ({ position, type }) =>
      new PlaneImpl(position, slotsMap.get(position)!, type)
  )
}
