import { PI } from '../constants'

export default class Plane {
  filledSlots: number;
  position: string;
  type: string;
  constructor(filledSlots: number, position: string, type: string) {
    this.filledSlots = filledSlots
    this.position = position
    this.type = type
  }

  get theta() {
    switch (this.position) {
      case 'lead':
        return PI / 2
      case 'lt':
        return 7 * PI / 6
      case 'rt':
        return 11 * PI / 6
      default:
        throw new Error();
    }
  }
}