import { createSelector } from "reselect";
import buildSlots from "../formation/buildSlots";
import buildFormation from "../formation/buildFormation";
import getSlotOptions, { getPlanesConfig } from "./getSlotOptions";
import buildPlanes from "../formation/buildPlanes";

export { default as getSlotOptions } from './getSlotOptions'

const getSlots = (state: any) => getSlotOptions(state).slots
const getBaseSize = (state: any): number => state.formationConfig.baseSize

export const getFormation = createSelector([getSlots, getBaseSize], buildFormation)
export const getPlanes = createSelector([getSlots, getBaseSize, getPlanesConfig], buildPlanes)
export const getAllSlots =  createSelector([getFormation, getPlanes], buildSlots)