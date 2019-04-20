import Polar from "../geometry/Polar";
import PlanePosition from "./PlanePosition";

export type NumDict<V> = { [index:number]:V }

export interface BaseSlot {}

export interface Slot extends BaseSlot {
    formationSlotId: number
    planeId: number
    planeSlotId: number
}

export interface FormationSlot extends BaseSlot {
    offset: Polar //offset of component
    position: Polar //position relative to center of component
    dockAngle: number // angle of half of the wingspan of the slot
    buildOrder: number //build order of slot
    [x: string]: any //allow arbitrary extra props for now
}

export interface PlaneSlot extends BaseSlot {
// PlaneSlot
//     - slotId PK
//     - details to compute score w/ formation slot
//     - drawing details - 
}



export interface SlotCollection<S extends BaseSlot> {
    slots: S[]
}




export interface Formation extends SlotCollection<FormationSlot> {
    baseIds: number[]
}

export interface Plane extends SlotCollection<PlaneSlot> {
    position: PlanePosition
    theta: number
    filledSlots: number
    // Plane
//     - planeId
//     - position info, detials to compute plane scores etc
//     - idx planeSlotId -> planeslot

}









// 1) build formation, get slotId -> formationSlotId
// 2) get planes, slotId -> planeId
// 3) get slotId -> planeSlotId

export default null