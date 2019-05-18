import { SlotData, Plane } from "../formation/interfaces"
import { BaseType } from "d3"
import { y } from "./slotdatafuns"

export interface Drawer<Args, ReturnArgs> {
  group: d3.Selection<SVGGElement, {}, null, undefined>
  withGroup(element: d3.Selection<SVGGElement, {}, null, undefined>): this
  draw(args: Args, transition: any | undefined): ReturnArgs
}

// export interface PlaneDrawer<Args, ReturnArgs>
//   extends Drawer<Args, ReturnArgs> {
//   x(d: SlotData): number
//   y(d: SlotData): number
// }

export interface PlaneDrawer {
  draw(
    g: d3.Selection<SVGGElement, SlottedPlane, BaseType, any>,
    t: d3.Transition<BaseType, any, any, any>
  ): void

  x(d: SlotData): number
  y(d: SlotData): number
}

export interface SlottedPlane {
  plane: Plane
  slotData: SlotData[]
}

export interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
}
