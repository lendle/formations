import Polar from "./Polar";
import Component from "./Component";
import { PI, TAU } from "../constants";

export default class Base extends Component {
    constructor(slots, extraSlotProps, rotation = 3 * PI / 2) {
        super(slots, 0, extraSlotProps)
        this._rotation = rotation
    }

    //angle to the first slot
    rotation() {
        return this._rotation
    }

    position() {
        return new Polar(0, 0)
    }

    // circumference = 2 PI r
    // circumference = # slots
    radius() {
        return this.slots / TAU
    }

    //angle between slot position and dock position
    dockAngle() {
        return TAU / (this.slots * 2)
    }

    buildOrder(slot) {
        this.checkSlot(slot)
        return 1
    }
}