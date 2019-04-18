import { createSelector } from "reselect";
import { PlaneTypes, SlottingOptions } from "../actions";

export const getFormationConfig = state => state.formationConfig
export const getPlanesConfig = state => state.planesConfig

/**
* computes min, max, and current number of slots based on plane and formation config
* 
* if current slots is outside of [min, max], it is set to min or max
*/
export default createSelector([getFormationConfig, getPlanesConfig],
    (formationConfig, planesConfig) => {
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
    })
    