import { createSelector } from "reselect"
import {
  PlaneType,
  Slotting,
  FormationConfigState,
  PlaneState
} from "../store/types"
import { AppState } from "../store/reducer"

export const getFormationConfig = (state: AppState): FormationConfigState =>
  state.formationConfig
export const getPlanesConfig = (state: AppState): PlaneState[] =>
  state.planesConfig

type SlotOptions = {
  slots: number;
  min: number;
  max: number;
}

const slotOptions = (
  formationConfig: { baseSize: number; slots: number },
  planesConfig: PlaneState[]
): SlotOptions => {
  const { min, max } = planesConfig
    .filter(({ type }) => type !== PlaneType.NONE)
    .map(({ slotting, slots }) => ({
      //compute min/max slots on each plane
      planeMin: slotting === Slotting.FILL ? slots : 0,
      planeMax: slots
    }))
    .reduce(
      ({ min, max }, { planeMin, planeMax }) => ({
        //add min/max slots for all planes
        min: min + planeMin,
        max: max + planeMax
      }),
      { min: 0, max: 0 }
    )

  const fixedMin = Math.max(min, formationConfig.baseSize)

  return {
    min: fixedMin,
    max,
    slots: Math.max(Math.min(formationConfig.slots, max), fixedMin)
  }
}

/**
 * computes min, max, and current number of slots based on plane and formation config
 *
 * if current slots is outside of [min, max], it is set to min or max
 */
export default createSelector(
  [getFormationConfig, getPlanesConfig],
  slotOptions
)
