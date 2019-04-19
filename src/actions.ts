export const SET_PLANE_SLOTTING = 'SET_PLANE_SLOTTING'
export const SET_PLANE_TYPE = 'SET_PLANE_TYPE'
export const SET_PLANE_SLOTS = 'SET_PLANE_SLOTS'
export const SET_FORMATION_SLOTS = 'SET_FORMATION_SLOTS'
export const SET_FORMATION_TYPE = 'SET_FORMATION_TYPE'
export const SET_BASE_SIZE = 'SET_BASE_SIZE'
export const SET_COLOR_BY = 'SET_COLOR_BY'
export const SET_NUMBER_BY = 'SET_NUMBER_BY'

export enum SlottingOptions {
    SPLIT='Split',
    FILL='Fill'
}

export enum PlaneTypes {
    NONE = 'None',
    OTTER = 'Otter',
    SKYVAN = 'Skyvan'
}

export enum ColorOptions {
    DEFAULT = 'DEFAULT',
    PLANE = 'PLANE',
    BUILD_ORDER = 'BUILD_ORDER'
}

export enum NumberOptions {
    SLOT_NUM = 'SLOT_NUM',
    BUILD_ORDER = 'BUILD_ORDER'
}

export enum FormationTypes {
    HD = 'HD',
    SD = 'SD'
}

export const baseSize = (baseSize: number) => ({
    type: SET_BASE_SIZE, 
    payload: baseSize
})

export const formationSlots = (slots: number) => ({
    type: SET_FORMATION_SLOTS,
    payload: slots
})

export const setFormationType = (formationType: FormationTypes) => ({
    type: SET_FORMATION_TYPE,
    payload: formationType
})

export const setPlaneSlotting = (plane: string, slotting: SlottingOptions) => ({
    type: SET_PLANE_SLOTTING,
    plane: plane,
    payload: slotting
})

export const setPlaneType = (plane: string, type: PlaneTypes) => ({
    type: SET_PLANE_TYPE,
    plane: plane,
    payload: type
})

export const setPlaneSlots = (plane: string, slots: number) => ({
    type: SET_PLANE_SLOTS,
    plane: plane,
    payload: slots
})

export const setColorBy = (colorBy: ColorOptions) => ({
    type: SET_COLOR_BY,
    payload: colorBy
})

export const setNumberBy = (numberBy: NumberOptions) => ({
    type: SET_NUMBER_BY,
    payload: numberBy
})