import { createSelector } from "reselect";
import { PlaneTypes, SlottingOptions } from "../actions";
import { PlaneConfig } from "../formation/buildPlanes";
import { max } from "d3";

//todo anys
export const getFormationConfig = (state: any):any => state.formationConfig
export const getPlanesConfig = (state: any):PlaneConfig[]  => state.planesConfig

type SlotOptions = {
    slots: number, 
    min: number,
    max: number
}

const slotOptions = (formationConfig: {baseSize: number, slots: number}, planesConfig: PlaneConfig[]): SlotOptions => {
    const {min,max} = planesConfig.filter(({type}) => type !== PlaneTypes.NONE)
    .map(({slotting, slots}) => ({ //compute min/max slots on each plane
        planeMin: slotting === SlottingOptions.FILL? slots: 0,
        planeMax: slots
    })).reduce(({min, max}, {planeMin, planeMax}) => ({ //add min/max slots for all planes
        min: min + planeMin,
        max: max + planeMax
    }), {min: 0, max: 0}) 
    
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
export default createSelector([getFormationConfig, getPlanesConfig], slotOptions)
    