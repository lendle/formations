import {
  Plane,
  Slot,
  PlaneSlot,
  Formation,
  FormationSlot
} from "../formation/interfaces"
import AbstractDrawer from "./AbstractDrawer"
import * as d3 from "d3"
import PlanePosition from "../formation/PlanePosition"
import { ViewConfigState, ShowOption } from "../store/types"
import Polar from "../geometry/Polar"
import { PI, SCALE_FACTOR, TAU } from "../constants"

type XY = {
  x: number;
  y: number;
}

interface SlottedPlane {
  plane: Plane
  slots: Slot[]
}

const x = (d: XY) => d.x * 40
const y = (d: XY) => d.y * 40

const w = 1.5
const l = 6
const otterPoints = [
  { x: -w, y: -l - 1 },
  { x: w, y: -l - 1 },
  { x: w, y: l },
  { x: -w, y: l },
  { x: -w, y: -l - 1 }
]

const doorPoints = [{ x: -w, y: l - 6 }, { x: -w, y: l - 2 }]

const line = d3
  .line<XY>()
  .x(x)
  .y(y)

/**
 *
 * @param g a selection (of g)
 * @param fill function mapping slotData to a fill color
 * @param label function mapping slotData to a label
 */
const addPlane = (
  g: d3.Transition<SVGGElement, SlottedPlane, SVGGElement, {}>,
  positionToCoordinate: Map<PlanePosition, Polar>
) => {
  g.call(gg =>
    gg.attr(
      "transform",
      ({ plane: { position } }) =>
        `translate(${positionToCoordinate.get(position)!.x}, ${
          positionToCoordinate.get(position)!.y
        }) scale(1)`
    )
  )
    .selection()
    .call(gg => gg.append("path").attr("d", line(otterPoints)!))
    .call(gg =>
      gg
        .append("path")
        .attr("stroke-width", 3)
        .attr("d", line(doorPoints)!)
    )
    .call(gg =>
      gg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("x", 0)
        .attr("y", -260)
        .text(({ plane: { position } }) => position)
    )
    .selectAll<SVGGElement, PlaneSlot & Slot>("g")
    .data<PlaneSlot & Slot>(
      ({ plane, slots }) =>
        slots.map(s => ({
          ...s,
          ...plane.slots[s.planeSlotId]
        })),
      d => d.formationSlotId.toString()
    )
    .join(
      enter =>
        enter
          .append("g")
          .call(slotG =>
            slotG
              .append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 16)
          )
          .call(slotG =>
            slotG
              .append("text")
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "central")
              .attr("x", x)
              .attr("y", y)
              // .text(d => d.jr)
              .text(d => d.formationSlotId + 1)
          ),
      update =>
        update
          .call(update =>
            update
              .select("circle")
              .attr("cx", x)
              .attr("cy", y)
          )
          .call(update =>
            update
              .select("text")
              .attr("x", x)
              .attr("y", y)
          ),
      exit => exit.remove()
    )
}
type PlanesAndCoordinates = {
  planes: Plane[];
  positionToCoordinate: Map<PlanePosition, Polar>;
}
const planesAndCoordinates = ({
  planes,
  viewConfig: { show },
  formation: { radius }
}: PlanesArgs): PlanesAndCoordinates => {
  switch (show) {
    case ShowOption.FORMATION:
      return { planes: [], positionToCoordinate: new Map() }
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
      return { planes, positionToCoordinate }
    }
    case ShowOption.BOTH: {
      const positionToCoordinate = new Map(
        planes.map(({ position, theta }) => {
          return [
            position,
            new Polar(
              (radius + 3) * SCALE_FACTOR,
              position === PlanePosition.LEAD ? TAU / 12 : theta
            )
          ]
        })
      )
      return { planes, positionToCoordinate }
    }
  }
}

interface PlanesArgs {
  slots: Slot[]
  planes: Plane[]
  formation: Formation
  viewConfig: ViewConfigState
}
export default class PlanesDrawer extends AbstractDrawer<PlanesArgs, void> {
  draw(args: PlanesArgs) {
    const { planes, positionToCoordinate } = planesAndCoordinates(args)

    const slottedPlanes: SlottedPlane[] = planes.map((plane, id) => ({
      plane,
      slots: args.slots.filter(({ planeId }) => id === planeId)
    }))

    const planeGrps = this.group
      .selectAll<SVGGElement, SlottedPlane>("g.plane")
      .data(slottedPlanes, sp => sp.plane.position)

    planeGrps
      .transition()
      .duration(1000)
      .call(addPlane, positionToCoordinate)

    planeGrps
      .enter()
      .append("g")
      .attr("class", "plane")
      .attr("transform", "translate(0,0) scale(0)")
      .transition()
      .duration(1000)
      .call(addPlane, positionToCoordinate)

    planeGrps
      .exit()
      .transition()
      .duration(1000)
      .attr("transform", "translate(0,0) scale(0)")
      .remove()
  }
}

//     protected computeSlots(): PlaneSlot[] {

//     }
