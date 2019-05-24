import PlanePosition from "../formation/PlanePosition"

export enum Slotting {
  SPLIT,
  FILL
}

export enum PlaneType {
  NONE,
  OTTER,
  SKYVAN
}

export enum ColorOption {
  DEFAULT,
  PLANE,
  BUILD_ORDER,
  RADIAL
}

export enum NumberOption {
  SLOT_NUM,
  SLOT_NUM_BY_PLANE,
  BUILD_ORDER
}

export enum ShowOption {
  FORMATION,
  PLANES,
  BOTH
}

export enum FormationType {
  HD,
  HD_ABOVE,
  HU
}

export interface PlaneState {
  position: PlanePosition
  label: string
  slotting: Slotting
  type: PlaneType
  slots: number
}

export interface FormationConfigState {
  slots: number
  baseSize: number
  type: FormationType
}

export interface ViewConfigState {
  colorBy: ColorOption
  numberBy: NumberOption
  show: ShowOption
}

export const SET_PLANE_SLOTTING = "SET_PLANE_SLOTTING"
interface SetPlaneSlottingAction {
  type: typeof SET_PLANE_SLOTTING
  position: PlanePosition
  slotting: Slotting
}

export const SET_PLANE_TYPE = "SET_PLANE_TYPE"
interface SetPlaneTypeAction {
  type: typeof SET_PLANE_TYPE
  position: PlanePosition
  planeType: PlaneType
}

export const SET_PLANE_SLOTS = "SET_PLANE_SLOTS"
interface SetPlaneSlotsAction {
  type: typeof SET_PLANE_SLOTS
  position: PlanePosition
  slots: number
}
export type PlanesConfigActionTypes =
  | SetPlaneSlottingAction
  | SetPlaneTypeAction
  | SetPlaneSlotsAction

export const SET_FORMATION_SLOTS = "SET_FORMATION_SLOTS"
interface SetFormationSlotsAction {
  type: typeof SET_FORMATION_SLOTS
  slots: number
}
export const SET_FORMATION_TYPE = "SET_FORMATION_TYPE"
interface SetFormationTypeAction {
  type: typeof SET_FORMATION_TYPE
  formationType: FormationType
}
export const SET_BASE_SIZE = "SET_BASE_SIZE"
interface SetBaseSizeAction {
  type: typeof SET_BASE_SIZE
  baseSize: number
}
export type FormationConfigActionTypes =
  | SetFormationSlotsAction
  | SetFormationTypeAction
  | SetBaseSizeAction

export const SET_COLOR_BY = "SET_COLOR_BY"
interface SetColorByAction {
  type: typeof SET_COLOR_BY
  colorBy: ColorOption
}
export const SET_NUMBER_BY = "SET_NUMBER_BY"
interface SetNumberByAction {
  type: typeof SET_NUMBER_BY
  numberBy: NumberOption
}

export const SET_SHOW = "SET_SHOW"
interface SetShowAction {
  type: typeof SET_SHOW
  show: ShowOption
}
export type ViewConfigActionTypes =
  | SetColorByAction
  | SetNumberByAction
  | SetShowAction

export const REFRESH_STATE = "REFRESH_STATE"
export interface RefreshStateAction {
  type: typeof REFRESH_STATE
}
