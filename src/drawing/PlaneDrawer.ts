import AbstractDrawer from "./AbstractDrawer";
import Plane from "../formation/Plane";
import { Slot } from "../formation/interfaces";

interface PlaneArgs {
    plane: Plane
    slots: Slot[]
}
abstract class PlaneDrawer<PlaneArgs> extends AbstractDrawer<PlaneArgs> {
    

}

