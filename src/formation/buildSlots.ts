import { Formation, Plane, Slot } from "./interfaces"
import planeify from "./planeify"
import slotify from "./slotify"

export default (formation: Formation, planes: Plane[]): Slot[] => {
  return slotify(formation, planes, planeify(formation, planes))
}
