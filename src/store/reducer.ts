import { combineReducers } from "redux"
import PlanePosition from "../formation/PlanePosition"
import {
  PlaneState,
  FormationConfigState,
  ViewConfigState,
  Slotting,
  PlaneType,
  FormationType,
  ColorOption,
  NumberOption,
  SET_PLANE_SLOTTING,
  SET_PLANE_SLOTS,
  SET_PLANE_TYPE,
  SET_FORMATION_SLOTS,
  SET_FORMATION_TYPE,
  SET_COLOR_BY,
  SET_NUMBER_BY,
  SET_BASE_SIZE,
  FormationConfigActionTypes,
  PlanesConfigActionTypes,
  ViewConfigActionTypes
} from "./types"

const { LEAD, LT, RT } = PlanePosition

const initialPlaneState: PlaneState[] = [
  {
    position: LEAD,
    label: "Lead",
    slotting: Slotting.SPLIT,
    type: PlaneType.OTTER,
    slots: 23
  },
  {
    position: LT,
    label: "Left Trail",
    slotting: Slotting.SPLIT,
    type: PlaneType.NONE,
    slots: 23
  },
  {
    position: RT,
    label: "Right Trail",
    slotting: Slotting.SPLIT,
    type: PlaneType.OTTER,
    slots: 23
  }
]

const planesConfig = (
  state = initialPlaneState,
  action: PlanesConfigActionTypes
): PlaneState[] => {
  const position = action.position
  return state.map(p => {
    if (p.position !== position) {
      return p
    }
    switch (action.type) {
      case SET_PLANE_SLOTTING:
        return { ...p, slotting: action.slotting }
      case SET_PLANE_SLOTS:
        return { ...p, slots: action.slots }
      case SET_PLANE_TYPE:
        return { ...p, type: action.planeType }
      default:
        return p
    }
  })
}

const formationConfig = (
  state = { slots: 42, baseSize: 6, type: FormationType.HD },
  action: FormationConfigActionTypes
): FormationConfigState => {
  switch (action.type) {
    case SET_FORMATION_SLOTS:
      return { ...state, slots: action.slots }
    case SET_BASE_SIZE:
      return { ...state, baseSize: action.baseSize }
    case SET_FORMATION_TYPE:
      return { ...state, type: action.formationType }
    default:
      return state
  }
}

const viewConfig = (
  state = { colorBy: ColorOption.PLANE, numberBy: NumberOption.SLOT_NUM },
  action: ViewConfigActionTypes
): ViewConfigState => {
  switch (action.type) {
    case SET_COLOR_BY:
      return { ...state, colorBy: action.colorBy }
    case SET_NUMBER_BY:
      return { ...state, numberBy: action.numberBy }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  planesConfig,
  formationConfig,
  viewConfig
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer