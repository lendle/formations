import { Formation, Plane, Slot } from "./interfaces";
import planeify from "./planeify";

export default (formation: Formation, planes: Plane[]): Slot[] => {
    return planeify(formation, planes).map((slot) => ({
        ...slot,
        planeSlotId: 0
    }))
}