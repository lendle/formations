import {PI} from '../constants'

export default class Plane {
    constructor(filledSlots, position, type) {
      this.filledSlots = filledSlots
      this.position = position
      this.type=type
    }
    
    get theta() {
      return { lead: PI/2, lt: 7 * PI/6, rt: 11 * PI / 6 }[this.position]
    }
  }