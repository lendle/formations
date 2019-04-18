import { ColorOptions, NumberOptions, SET_COLOR_BY, SET_NUMBER_BY, FormationTypes, SET_FORMATION_SLOTS, SET_BASE_SIZE, SET_FORMATION_TYPE, SET_PLANE_SLOTS, SET_PLANE_SLOTTING, SET_PLANE_TYPE, SlottingOptions, PlaneTypes } from "./actions";
import { combineReducers } from "redux";

const initialPlaneState = [
    {
        plane: 'lead',
        label: 'Lead',
        slotting: SlottingOptions.SPLIT,
        type: PlaneTypes.OTTER,
        slots: 23
    },
    {
        plane: 'lt',
        label: 'Left Trail',
        slotting: SlottingOptions.SPLIT,
        type: PlaneTypes.NONE,
        slots: 23
    },
    {
        plane: 'rt',
        label: 'Right Trail',
        slotting: SlottingOptions.SPLIT,
        type: PlaneTypes.OTTER,
        slots: 23
    }
]

const planesConfig = (state = initialPlaneState, { type, plane, payload }) => {
    return state.map(p => {
        if (p.plane !== plane) {
            return p
        }
        switch (type) {
            case SET_PLANE_SLOTS:
                return { ...p, slots: payload }
            case SET_PLANE_SLOTTING:
                return { ...p, slotting: payload }
            case SET_PLANE_TYPE:
                return { ...p, type: payload }
            default:
                return p
        }
    })
}

const formationConfig = (state = { slots: 42, baseSize: 6, type: FormationTypes.HD }, { type, payload }) => {
    switch (type) {
        case SET_FORMATION_SLOTS:
            return { ...state, slots: payload }
        case SET_BASE_SIZE:
            return { ...state, baseSize: payload }
        case SET_FORMATION_TYPE:
            return { ...state, type: payload }
        default:
            return state
    }

}

const viewConfig = (
    state = { colorBy: ColorOptions.PLANE, numberBy: NumberOptions.SLOT_NUM },
    { type, payload }) => {
    switch (type) {
        case SET_COLOR_BY:
            return { ...state, colorBy: payload }
        case SET_NUMBER_BY:
            return { ...state, numberBy: payload }
        default:
            return state
    }
}

export default combineReducers({ planesConfig, formationConfig, viewConfig })