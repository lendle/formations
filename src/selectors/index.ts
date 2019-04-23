import { createSelector } from "reselect"
import buildSlots from "../formation/buildSlots"
import buildFormation from "../formation/buildFormation"
import getSlotOptions from "./getSlotOptions"
import buildPlanes from "../formation/buildPlanes"
import { AppState } from "../store/reducer"
import { PlaneType } from "../store/types"

export { default as getSlotOptions } from "./getSlotOptions"

const getSlots = (state: AppState) => getSlotOptions(state).slots
const getBaseSize = (state: AppState): number => state.formationConfig.baseSize
const getFilteredPlanesConfig = (state: AppState) => {
  return state.planesConfig.filter(({ type }) => type !== PlaneType.NONE)
}

export const getFormation = createSelector(
  [getSlots, getBaseSize],
  buildFormation
)
export const getPlanes = createSelector(
  [getSlots, getBaseSize, getFilteredPlanesConfig],
  buildPlanes
)
export const getAllSlots = createSelector(
  [getFormation, getPlanes],
  buildSlots
)
