import { combineReducers, Reducer, AnyAction } from "redux"
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
  ViewConfigActionTypes,
  SET_SHOW,
  ShowOption,
  REFRESH_STATE,
  SET_PLANE_VIDEO,
  SET_SHOW_PLANE_NUMBERS
} from "./types"

const { LEAD, LT, RT } = PlanePosition

const initialPlaneState: PlaneState[] = [
  {
    position: LEAD,
    label: "Lead",
    slotting: Slotting.SPLIT,
    type: PlaneType.SKYVAN,
    slots: 23,
    hasSuperFloat: false,
    hasVideo: true
  },
  {
    position: LT,
    label: "Left Trail",
    slotting: Slotting.SPLIT,
    type: PlaneType.NONE,
    slots: 23,
    hasSuperFloat: false,
    hasVideo: false
  },
  {
    position: RT,
    label: "Right Trail",
    slotting: Slotting.SPLIT,
    type: PlaneType.OTTER,
    slots: 23,
    hasSuperFloat: false,
    hasVideo: false
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
      case SET_PLANE_VIDEO:
        return { ...p, hasVideo: action.hasVideo }
      default:
        return p
    }
  })
}

const formationConfig = (
  state = { slots: 45, baseSize: 6, type: FormationType.HD },
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
  state = {
    colorBy: ColorOption.PLANE,
    numberBy: NumberOption.SLOT_NUM_BY_PLANE,
    showPlaneNumbers: true,
    show: ShowOption.BOTH
  },
  action: ViewConfigActionTypes
): ViewConfigState => {
  switch (action.type) {
    case SET_COLOR_BY:
      return { ...state, colorBy: action.colorBy }
    case SET_NUMBER_BY:
      return { ...state, numberBy: action.numberBy }
    case SET_SHOW:
      return { ...state, show: action.show }
    case SET_SHOW_PLANE_NUMBERS:
      return { ...state, showPlaneNumbers: action.showPlaneNumbers }
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

const refreshingReducer: Reducer<AppState, AnyAction> = (state, action) => {
  switch (action.type) {
    case REFRESH_STATE:
      return rootReducer(undefined, action)
    default:
      return rootReducer(state, action)
  }
}

export default refreshingReducer
