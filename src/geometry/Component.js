import Polar from "./Polar"
import _ from 'lodash'

import {range} from 'd3'

export default class Component {
  
    constructor(slots, extraSlotProps) {
      if (slots < 0) {
        throw new Error(`slots should be non-negative, was ${slots}`)
      }
      this.slots=slots
      
      if (_.isFunction(extraSlotProps)) {
        this.extraSlotProps = [extraSlotProps]
      } else if (_.isArray(extraSlotProps)) {
        this.extraSlotProps = extraSlotProps
      } else if (extraSlotProps === undefined) {
        this.extraSlotProps = []          
      } else {
        throw new Error('extraSlotProps should be a function, array, or undefined/null')
      }
    }
  
    checkSlot(slot) {
      if (slot < 0 || slot >= this.slots) throw new Error(`slot should be in [0, ${this.slots}), was ${slot}`)
    }
  
    slotData(slot) {
      this.checkSlot(slot)
  
      const thisComponent = this
  
      const extraProps = this.extraSlotProps.reduce((obj, f) => ({ 
          ...obj, 
          ...f.call(thisComponent, slot, obj)
        }), {})
  
      if (!_.isObject(extraProps)) {
        console.error(`Extra props for slot ${slot} couldn't be constructed, ignoring. Was: `, extraProps)
      }
      
      return Object.assign(
        {},//always start with a fresh object
        _.isObject(extraProps) ? extraProps: {},
        {
          offset: this.position(),
          position: this.slotPosition(slot),
          dockAngle: this.dockAngle(),
          id: slot,
          buildOrder: this.buildOrder(slot)
        })
    }
  
    allSlotData() {
      return range(this.slots).map(slot => this.slotData(slot))
    }
  
    //returns position of slot *relative to position of component*
    slotPosition(s, offset=false) {
      this.checkSlot(s)
      const pos = new Polar(this.radius(),
                            this.rotation() - 2 * s * this.dockAngle())
      return offset? pos.plus(this.position()) : pos
    }
  
    //returns position of left hand of slot *relative to center of formation*
    dockPosition(s) {
      this.checkSlot(s)
      return this.slotPosition(s)
        .rotate(-this.dockAngle())
        .plus(this.position())
    }
    
    //should return build order for slot, or if slot is not defined, return build order for last slot
    buildOrder(slot) { throw new Error("build order not implemented") }
    
    //returns radius of this component
    radius() { throw new Error("radius not implemented") }
  
    //returns center of this component
    position() { throw new Error("position not implemented") }
  
    //returns rotation in theta of where to place first slot
    rotation() { throw new Error("rotation not implemented") }
  
    //returns angle between slot position and dock position, i.e. half of wingspan angle
    dockAngle() { throw new Error("dockAngle not implemented") }
  }

  