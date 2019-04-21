import { createSelector } from "reselect"
import buildSlots from "../formation/buildSlots"
import buildFormation from "../formation/buildFormation"
import getSlotOptions, { getPlanesConfig } from "./getSlotOptions"
import buildPlanes from "../formation/buildPlanes"
import { AppState } from "../store/reducer"

export { default as getSlotOptions } from './getSlotOptions'

const getSlots = (state: AppState) => getSlotOptions(state).slots
const getBaseSize = (state: AppState): number => state.formationConfig.baseSize

export const getFormation = createSelector([getSlots, getBaseSize], buildFormation)
export const getPlanes = createSelector([getSlots, getBaseSize, getPlanesConfig], buildPlanes)
export const getAllSlots =  createSelector([getFormation, getPlanes], buildSlots)