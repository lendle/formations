import { PI, TAU } from "../../constants";
import Component from "./Component";
import Polar from "../../geometry/Polar";

interface Dock {
  c: Component
  s: number
}

export default class Round extends Component {
  left: Dock;
  right: Dock;
  firstRun: boolean;
  _prrd: any;
    /*
    left and right are left hand and right hand docks. 
    Should be an with properties
      - c: component
      - s: slot index
    */
    constructor(slots: number, slotNumOffset: number, left: Dock, right: Dock) {
      super(slots, slotNumOffset)
      this.left = left
      this.right = right
      this.firstRun = true
    }
  
    get prrd() {
      if (!this._prrd) {
        this._prrd = Round._positionRadiusRotationDockAngle(
        this.left.c.dockPosition(this.left.s),
        this.right.c.dockPosition(this.right.s), 
        this.slots
        )
      }
      return this._prrd
    }
    
    //computes the centroid position
    //component radius, and component rotation
    //position, radius, rotation, dockangle
    /*
    leftDockPosition - where component's left hand dock is
    rightDockPosition - where component's right hand dock is
    slots - number of slots in this component
    // parentCentroid - centroid of parent component, or center of formation. Used to pick the orien
    */
    static _positionRadiusRotationDockAngle(leftDockPosition: Polar, rightDockPosition: Polar, slots: number, 
                                             parentCentroid = new Polar(0,0)) {
  
      const dockDistance = leftDockPosition.distanceFrom(rightDockPosition)
      const {radius, theta} = Round.__computeRadiusTheta(slots, dockDistance)
  
  
  
      const angleDelta = leftDockPosition.angleTo(rightDockPosition)
      const position = leftDockPosition.plus(new Polar(radius, angleDelta - (PI - theta)/2))
  
      //the rotation is where the first slot (docking w/ right hand) goes
      // TAU - theta is the whole arc angle, and their position is 1/(2*slots) around
      const dockAngle = (TAU - theta)/(2*slots)
      const rotation = position.angleTo(rightDockPosition) - dockAngle
      
      return { position, radius, rotation, dockAngle } 
    }
    
    position() {
      return this.prrd.position
    }
    
    radius() {
      return this.prrd.radius
    }
    
    rotation() {
      return this.prrd.rotation
    }
  
    dockAngle() {
      return this.prrd.dockAngle
    }
  
    maxBuildOrder() {
      return Math.max(this.left.c.maxBuildOrder(), this.right.c.maxBuildOrder()) + Math.ceil(this.slots/2)
    }

    buildOrder(slot: number) { 
      this.checkSlot(slot)
      const waiting = Math.max(this.left.c.maxBuildOrder(), this.right.c.maxBuildOrder())
      
      //build from the ends
      return waiting + Math.min(slot + 1, this.slots - slot)
    }
  
    // computes radius and angle of cutoff for a circle with the side cut off
    // with length of the remaining curve part = s
    // and length of flat bit = d
    // I think it's O(-log(eps))
    static __computeRadiusTheta(s: number, d: number, eps = Math.sqrt(Number.EPSILON)) {
      if (d < 0 || d > s) {
        console.error(`d: ${d}, s: ${s}`)
        throw new Error("d must be in [0, s]")
      }
      var iters = 0
      //try picking theta between lower and upper
      function iter(lower=0, upper=PI): number {
        if (iters >= 100) {
          throw new Error("didn't converge")
        }
        iters = iters + 1
        const mid = (upper + lower)/2
        // if ((upper - lower) < eps) {
        //   return mid
        // }
  
        //candidate theta = mid
        //compute radius from theta
        const r = d / (2 * Math.sin(mid / 2))
        //compute s from radius, theta
        const ss = r * (TAU - mid)
        
        if (Math.abs(ss - s) < eps) {
          return mid
        }
        
        //if computed s is too big, try a bigger theta, else try smaller
        return ss > s ? iter(mid, upper) : iter(lower, mid)
      }
      //iter returns theta, compute radius
      const theta = iter()
      return {
        radius: s / (TAU-iter()),
        theta: theta 
      }
    }
  }