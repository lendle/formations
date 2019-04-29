import { PlaneDrawer, SlottedPlane } from "./interfaces"
import * as d3 from "d3"
import { Selection, BaseType } from "d3"
import PlanePosition from "../formation/PlanePosition"
import { PlaneType } from "../store/types"
import { SlotData, NumDict } from "../formation/interfaces"

const PLANE_SCALE_FACTOR = 40

type XY = {
  x: number;
  y: number;
}

const positionLabels = {
  [PlanePosition.LEAD]: "Lead",
  [PlanePosition.LT]: "Left Trail",
  [PlanePosition.RT]: "Right Trail"
}

const w = 1.5
const l = 6.5

const line = d3
  .line<XY>()
  .x(d => d.x * PLANE_SCALE_FACTOR)
  .y(d => d.y * PLANE_SCALE_FACTOR)

export class OtterDrawer implements PlaneDrawer {
  private otterPoints = [
    { x: -w, y: -l },
    { x: w, y: -l },
    { x: w, y: l },
    { x: -w, y: l },
    { x: -w, y: -l }
  ]

  private doorPoints = [{ x: -w, y: l - 6 }, { x: -w, y: l - 2 }]

  /**
   *      23 22
   *      21 20
   *      19 18
   *      17 16
   *      15 14
   *   6  13 12
   *   5
   *   4  9 11
   *   3  8 10
   *   2  7
   *   1
   *   0
   */
  private slotCoords = [
    //floaters
    ...d3.range(7).map(y => ({ x: -2, y: 6 - y })),
    //first row in door
    ...d3.range(3).map(y => ({ x: -1, y: 3.5 - y })),
    //2nd row in door
    ...d3.range(2).map(y => ({ x: 0, y: 3 - y })),
    //divers
    ...d3.range(6).flatMap(y => [{ x: 0.5, y: -y }, { x: -0.5, y: -y }])
  ]
  draw(g: Selection<SVGGElement, SlottedPlane, BaseType, any>) {
    g.append("path").attr("d", line(this.otterPoints)!)
    g.append("path")
      .attr("stroke-width", 3)
      .attr("d", line(this.doorPoints)!)
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("x", 0)
      .attr("y", (-l + 1) * PLANE_SCALE_FACTOR)
      .text(d => positionLabels[d.plane.position])
  }

  x = (d: SlotData) => this.slotCoords[d.planeSlotId].x * PLANE_SCALE_FACTOR
  y = (d: SlotData) => this.slotCoords[d.planeSlotId].y * PLANE_SCALE_FACTOR
}

export class SkyvanDrawer implements PlaneDrawer {
  private skyvanPoints = [
    { x: -w, y: -l },
    { x: w, y: -l },
    { x: w, y: l },
    { x: -w, y: l },
    { x: -w, y: -l }
  ]

  private doorPoints = [{ x: -w, y: l }, { x: w, y: l }]
  private redLine = [{ x: -w, y: l - 4 }, { x: w, y: l - 4 }]

  /**
   *       x
   *     x  22
   *     x  20
   *     x  18
   *     x  16
   *     x  14
   *     x  12
   *     9  10
   *   ---------
   *     7   8
   *     5   6
   *     3   4
   *   0   1   2
   *
   */
  private slotCoords = [
    //1st row
    { x: -1, y: 6 },
    { x: 0, y: 6 },
    { x: 1, y: 6 },
    // the rest on back
    ...d3.range(11).flatMap(y => [{ x: -0.5, y: 5 - y }, { x: 0.5, y: 5 - y }])
  ]
  draw(g: Selection<SVGGElement, SlottedPlane, BaseType, any>) {
    g.append("path").attr("d", line(this.skyvanPoints)!)
    g.append("path")
      .attr("stroke-width", 3)
      .attr("d", line(this.doorPoints)!)

    g.append("path")
      .attr("stroke-width", 2)
      .style("stroke", "red")
      .attr("d", line(this.redLine)!)
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("x", 0)
      .attr("y", (-l + 1) * PLANE_SCALE_FACTOR)
      .text(d => positionLabels[d.plane.position])
  }

  x = (d: SlotData) => this.slotCoords[d.planeSlotId].x * PLANE_SCALE_FACTOR
  y = (d: SlotData) => this.slotCoords[d.planeSlotId].y * PLANE_SCALE_FACTOR
}

export const planeDrawers: NumDict<PlaneDrawer> = {
  [PlaneType.OTTER]: new OtterDrawer(),
  [PlaneType.SKYVAN]: new SkyvanDrawer()
}
