import { Plane, SlotData, Formation } from "../formation/interfaces"
import AbstractDrawer from "./AbstractDrawer"
import * as d3 from "d3"
import PlanePosition from "../formation/PlanePosition"
import { ViewConfigState, ShowOption } from "../store/types"
import Polar from "../geometry/Polar"
import { PI, SCALE_FACTOR, TAU } from "../constants"
import {
  planeX,
  planeY,
  addSlot,
  updateSlot,
  transitionOut,
  SlotDataFun
} from "./slotdatafuns"
import { BaseType } from "d3"
import { OtterDrawer, planeDrawers } from "./planedrawers"
import { SlottedPlane } from "./interfaces"

const planeCoordinates = ({
  planes,
  viewConfig: { show },
  formation: { radius }
}: PlanesArgs) => {
  switch (show) {
    case ShowOption.FORMATION:
      return new Map()
    case ShowOption.PLANES: {
      const positions = planes.map(p => p.position)
      const positionToCoordinate = new Map(
        [PlanePosition.LT, PlanePosition.LEAD, PlanePosition.RT]
          .filter(p => positions.includes(p))
          .map((p, idx, all) => {
            const offset = idx * 300 - (all.length - 1) * 150
            return [p, new Polar(Math.abs(offset), offset >= 0 ? 0 : PI)]
          })
      )
      return positionToCoordinate
    }
    case ShowOption.BOTH: {
      const positionToCoordinate = new Map(
        planes.map(({ position, theta }) => {
          return [
            position,
            new Polar(
              Math.max(7, radius + 3) * SCALE_FACTOR,
              position === PlanePosition.LEAD ? TAU / 12 : theta
            )
          ]
        })
      )
      return positionToCoordinate
    }
  }
}

interface PlanesArgs {
  slots: SlotData[]
  planes: Plane[]
  formation: Formation
  viewConfig: ViewConfigState
  fill: SlotDataFun
  label: SlotDataFun
}
export default class PlanesDrawer extends AbstractDrawer<PlanesArgs, void> {
  draw(args: PlanesArgs) {
    const p2c = planeCoordinates(args)

    const { fill, label } = args

    // const label = (d: SlotData) => d.plane.slots[d.planeSlotId].jr.toString()

    const slotsByPlane = Array.from(
      args.slots.reduce((map, slotData) => {
        const array = map.get(slotData.plane) || []
        array.push(slotData)
        return map.set(slotData.plane, array)
      }, new Map<Plane, SlotData[]>())
    ).map(([plane, slotData]) => ({ plane, slotData }))

    const t = d3.transition().duration(1000) as d3.Transition<
      BaseType,
      any,
      any,
      any
    >

    this.group
      .selectAll<SVGGElement, SlottedPlane>("g.plane")
      .data<SlottedPlane>(
        slotsByPlane,
        d => `${d.plane.position}.${d.plane.type}`
      )
      .join(
        enter =>
          enter
            .append("g")
            .classed("plane", true)
            .each(({ plane }, i, nodes) => {
              planeDrawers[plane.type].draw(d3.select(nodes[i]))
            })
            .attr("transform", "translate(0,0) scale(0)"),
        undefined,
        exit => transitionOut(exit, t)
      )
      .transition(t)
      .attr(
        "transform",
        ({ plane: { position } }) =>
          `translate(${p2c.get(position)!.x},${p2c.get(position)!.y}) scale(1)`
      )
      .selection()
      .selectAll<SVGGElement, SlotData>("g.slot")
      .data(d => d.slotData, d => `${d.formationSlotId}.${d.planeId}`)
      .join(enter => addSlot(enter), undefined, exit => transitionOut(exit, t))
      .transition(t)
      .attr("transform", "scale(1)")
      .call(slotG => {
        updateSlot(slotG, planeX, planeY, fill, label)
      })
  }
}
