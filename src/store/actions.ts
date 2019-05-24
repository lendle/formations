import {
  SET_BASE_SIZE,
  SET_FORMATION_SLOTS,
  SET_FORMATION_TYPE,
  SET_PLANE_SLOTTING,
  SET_PLANE_TYPE,
  SET_PLANE_SLOTS,
  SET_COLOR_BY,
  SET_NUMBER_BY,
  ColorOption,
  NumberOption,
  PlaneType,
  Slotting,
  FormationType,
  FormationConfigActionTypes,
  PlanesConfigActionTypes,
  ViewConfigActionTypes,
  ShowOption,
  SET_SHOW,
  REFRESH_STATE,
  RefreshStateAction
} from "./types"
import PlanePosition from "../formation/PlanePosition"

export const baseSize = (baseSize: number): FormationConfigActionTypes => ({
  type: SET_BASE_SIZE,
  baseSize
})

export const formationSlots = (slots: number): FormationConfigActionTypes => ({
  type: SET_FORMATION_SLOTS,
  slots
})

export const setFormationType = (
  formationType: FormationType
): FormationConfigActionTypes => ({
  type: SET_FORMATION_TYPE,
  formationType
})

export const setPlaneSlotting = (
  position: PlanePosition,
  slotting: Slotting
): PlanesConfigActionTypes => ({
  type: SET_PLANE_SLOTTING,
  position,
  slotting
})

export const setPlaneType = (
  position: PlanePosition,
  type: PlaneType
): PlanesConfigActionTypes => ({
  type: SET_PLANE_TYPE,
  position,
  planeType: type
})

export const setPlaneSlots = (
  position: PlanePosition,
  slots: number
): PlanesConfigActionTypes => ({
  type: SET_PLANE_SLOTS,
  position,
  slots
})

export const setColorBy = (colorBy: ColorOption): ViewConfigActionTypes => ({
  type: SET_COLOR_BY,
  colorBy
})

export const setNumberBy = (numberBy: NumberOption): ViewConfigActionTypes => ({
  type: SET_NUMBER_BY,
  numberBy
})

export const setShow = (show: ShowOption): ViewConfigActionTypes => ({
  type: SET_SHOW,
  show
})

export const refreshState = (): RefreshStateAction => ({ type: REFRESH_STATE })
