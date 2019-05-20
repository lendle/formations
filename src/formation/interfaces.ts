import Polar from "../geometry/Polar"
import PlanePosition from "./PlanePosition"
import { PlaneType, FormationType } from "../store/types"
import { Box } from "../geometry/Box"

export type NumDict<V> = { [index: number]: V }

export interface BaseSlot {}

export interface PlaneAssignment {
  formationSlotId: number
  planeId: number
}

export interface PlaenSlotAssignment extends PlaneAssignment {
  planeSlotId: number
}

export interface SlotData {
  formationSlotId: number
  formation: Formation
  formationSlot: FormationSlot
  planeId: number
  plane: Plane
  planeSlotId: number
  byPlaneSlotId: number
}

export interface ComponentSlot extends BaseSlot {
  offset: Polar //offset of component
  position: Polar //position relative to center of component
  dockAngle: number // angle of half of the wingspan of the slot
  buildOrder: number //build order of slot
}

export interface FormationSlot extends ComponentSlot {
  reverseBuildOrder: number //max time to build downstream slots
}

export interface PlaneSlot extends BaseSlot {
  // x: number //for plotting
  // y: number //for plotting
  jr: number // jump run score. 0 for ~ base, positive for before base (floaters), negative for after base (divers)
}

export interface SlotCollection<S extends BaseSlot> {
  slots: S[]
}

export interface Formation extends SlotCollection<FormationSlot> {
  baseIds: number[]
  radius: number
  box: Box
  type: FormationType
}

export interface Plane extends SlotCollection<PlaneSlot> {
  position: PlanePosition
  theta: number
  filledSlots: number
  type: PlaneType
  baseIds: number[]
  videoId: number
  superFloatId: number
}
