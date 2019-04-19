import Polar from "../geometry/Polar";
import _ from 'lodash'
import { PI } from "../constants";
import lap from "./lap";
import approxeq from "./approxeq";
import Base from "../geometry/Base.ts";

export default class Formation {
  constructor(components, planes, config) {
    this.components = components
    this.planes = planes
    this.config = config
    this.check()
    this.planeify()
  }
  
  /**
   * number of slots in formation
   */
  get slots() {
    return this.components.reduce((acc, c) => acc + c.slots, 0)
  }
  
  check() {
    const mustFill = this.planes.filter(p => p.fill).reduce((acc, p) => acc + p.totalSlots, 0)
    if (this.slots < mustFill) {
      throw new Error("can't fill all the planes")
    }
    
    const planeSlots = this.planes.reduce((acc, p) => acc + p.totalSlots, 0)
    if (this.slots > planeSlots) {
      throw new Error("not enough room in planes")
    }
    
    const positions = this.planes.map(p => p.position)
    if (new Set(positions).size !== positions.length) {
      throw new Error("plane positions are not unique")
    }
    
  }
  
  allSlotData() {
    return this.components.flatMap(c => c.allSlotData())
  }
  
  
  /**
   * Puts people in planes
   */
  planeify() {
    
    //slotnum to { c: component, i: slotIndex }
    const s2ci = this.components
    .flatMap(c => c.allSlotData().map((sd, i) => ({ slotNum: sd.slotNum, c, i })))
    .reduce((obj, { slotNum, c, i }) => { obj[slotNum] = { c, i }; return obj }, {})
    
    const unslotted = this.allSlotData().map(s => s.slotNum)
    
    // plane position to array of slotNums
    const slotted = this.planes.reduce((obj, p) => { obj[p.position] = []; return obj }, {})
    
    // ### rule based slotting ###
    // base in lead f
    const baseSlots = this.components.find(c => c instanceof Base)
    .allSlotData().map(s => s.slotNum)
    slotted.lead.push(...baseSlots)
    _.pull(unslotted, ...baseSlots)
    
    //todo add superfloat

    // ### end rule based slotting ###
    
    //using linear assignment problem formulation
    
    //array with plane repeated for the number of remaining slots in that plane
    //should have the same length as unslotted
    const planeArray = this.planes.flatMap(p => _.times(p.filledSlots - slotted[p.position].length, () => p))
        
    if (planeArray.length !== unslotted.length) {
      throw new Error("planeArray and unslotted have diff lenghts")
    }
    
    const angleScore = (slotNum, plane) => {
      const slotPosition = s2ci[slotNum].c.slotPosition(s2ci[slotNum].i, true)//true -> with offset
      const diff = Polar.unspin(slotPosition.theta - plane.theta)
      
      //penalize if component is on other side of jumprun from plane
      //componentTheta is component angle rotated 90 right
      // if > pi, right side of jump run. if < pi, left side of jump run
      const componentTheta = Polar.unspin(s2ci[slotNum].c.position().theta - PI / 2)
      const componentSide = approxeq(componentTheta, 0) || approxeq(componentTheta, PI) ? "center" :
      componentTheta > PI ? "rt" : "lt"
      const penalty = (componentSide === "center" || componentSide === plane.position || plane.position === "lead") ? 0 : PI
      
      return Math.min(diff, 2 * PI - diff) + penalty
    }
    
    //   const distScore = (slotNum, plane) => {
    //     const slotPosition = s2ci[slotNum].c.slotPosition(s2ci[slotNum].i, true)//true -> with offset
    //     return Math.abs(slotPosition.distanceFrom(new Polar(100, plane.theta)))
    //   }
    
    
    //takes a scoreFun that takes a slotNum and plane, 
    //and converts it to a function that takes i, j for i, j in [0, unslotted.length)
    //for use with lap()
    const cost = (scoreFun) => (i, j) => {
      const slotNum = unslotted[i]
      const plane = planeArray[j]
      return scoreFun(slotNum, plane)
    }
    
    const assignments = lap(unslotted.length, cost(angleScore)).row
    
    assignments.forEach((p, i) => {
      const plane = planeArray[p].position
      const slotNum = unslotted[i]
      slotted[plane].push(slotNum)
      // _.pull(unslotted, slotNum)
    })
    
    const slotNum2Plane = Object.entries(slotted).flatMap(
      ([p, slotNums]) => slotNums.map(s => ({ p, s }))
      ).reduce((obj, { p, s }) => { obj[s] = p; return obj }, {})
      
      this.components.forEach(component => {
        const idx2num = Object.fromEntries(component.allSlotData().map((s, i) => [i, s.slotNum]))
        component.extraSlotProps.push(s => ({ plane: slotNum2Plane[idx2num[s]] }))
      })
    }
    
  }