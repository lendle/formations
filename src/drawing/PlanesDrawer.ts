import {
  Plane,
  SlotData,
  Formation,
  FormationSlot
} from "../formation/interfaces"
import AbstractDrawer from "./AbstractDrawer"
import * as d3 from "d3"
import { group as d3Group } from "d3-array"
import PlanePosition from "../formation/PlanePosition"
import { ViewConfigState, ShowOption, FormationType } from "../store/types"
import Polar from "../geometry/Polar"
import { PI, SCALE_FACTOR, TAU } from "../constants"
import {
  planeX,
  planeY,
  addSlot,
  updateSlot,
  transitionOut,
  SlotDataFun,
  planeLabel
} from "./slotdatafuns"
import { BaseType } from "d3"
import { planeDrawers, line, PLANE_SCALE_FACTOR } from "./planedrawers"
import { SlottedPlane } from "./interfaces"
import { Box } from "../geometry/Box"

const planeCoordinates = ({
  planes,
  viewConfig: { show },
  formation: { radius, type }
}: PlanesArgs) => {
  switch (show) {
    case ShowOption.FORMATION:
    case ShowOption.PLANES: {
      //if we're only showing planes, then draw them in a line
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
      //if we're showing planes and formation, draw outside of formation radius
      const positionToCoordinate = new Map(
        planes.map(({ position, theta }) => {
          const coord = new Polar(
            Math.max(7, radius + 3) * SCALE_FACTOR,
            position === PlanePosition.LEAD ? TAU / 12 : theta
          )
          return [
            position,
            type === FormationType.HD ? coord.flip(PI / 2) : coord
          ]
        })
      )
      return positionToCoordinate
    }
  }
}

const labelPosition = ({ formation: { radius, type } }: PlanesArgs) => {
  const coord = new Polar(Math.max(7, radius + 3) * SCALE_FACTOR, TAU / 12)
  return type === FormationType.HD ? coord : coord.flip(PI / 2) // flip on opposite side of lead plane
}

const drawLabel = (
  group: d3.Selection<SVGGElement, {}, null, undefined>,
  formation: Formation,
  t: d3.Transition<d3.BaseType, any, any, any>,
  labelCoord: Polar,
  show: ShowOption
) => {
  group
    .selectAll<SVGGElement, Formation>("g.label")
    .data(show === ShowOption.PLANES ? [] : [formation])
    .join(
      enter =>
        enter
          .append("g")
          .classed("label", true)
          .call(g => {
            g.append("path")
              .attr("d", line([{ x: 0, y: 0 }, { x: 0, y: -4 }])!)
              .attr("stroke-width", 3)
              .attr("stroke", "black")

            g.append("path")
              .attr("d", line([{ x: -1, y: -3 }, { x: 0, y: -4 }])!)
              .attr("stroke-width", 3)
              .attr("stroke", "black")

            g.append("path")
              .attr("d", line([{ x: 1, y: -3 }, { x: 0, y: -4 }])!)
              .attr("stroke-width", 3)
              .attr("stroke", "black")
            g.append("text")
              .classed("type", true)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "central")
              .attr("x", 0)
              .attr("y", PLANE_SCALE_FACTOR)

            g.append("text")
              .classed("slots", true)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "central")
              .attr("x", 0)
              .attr("y", 2 * PLANE_SCALE_FACTOR)
          })
          .attr("transform", "translate(0,0) scale(0)"),
      undefined,
      exit => transitionOut(exit, t)
    )
    .call(g => {
      g.select("text.type").text(d => {
        switch (d.type) {
          case FormationType.HD:
            return "Head Down from below"
          case FormationType.HD_ABOVE:
            return "Head Down from above"
          case FormationType.HU:
            return "Head Up"
          default:
            return "Unknown formation type"
        }
      })
      g.select("text.slots").text(d => `${d.slots.length} slots`)
    })
    .transition(t)
    .attr("transform", `translate(${labelCoord.x}, ${labelCoord.y})`)

  const labelBox =
    show === ShowOption.PLANES
      ? new Box(0, 0, 0, 0)
      : new Box(-3, -2, 3, 4).scale(PLANE_SCALE_FACTOR).translate(labelCoord)

  return labelBox
}

interface PlanesArgs {
  slots: SlotData[]
  planes: Plane[]
  formation: Formation
  viewConfig: ViewConfigState
  fill: SlotDataFun
  label: SlotDataFun
}
export default class PlanesDrawer extends AbstractDrawer<PlanesArgs, Box> {
  draw(args: PlanesArgs, t: d3.Transition<BaseType, any, any, any>) {
    const p2c = planeCoordinates(args)
    const labelCoord = labelPosition(args)

    const { fill, label } = args

    // const label = (d: SlotData) => d.plane.slots[d.planeSlotId].jr.toString()

    const slotsByPlane: SlottedPlane[] =
      args.viewConfig.show === ShowOption.FORMATION
        ? []
        : Array.from(d3Group(args.slots, d => d.plane))
            .map(([plane, slotData]) => ({ plane, slotData }))
            .map(({ plane, slotData }) => {
              // add in psuedo slot for video if plane has it

              const dummyFormationSlot: FormationSlot = {
                reverseBuildOrder: 0,
                buildOrder: 0,
                offset: new Polar(0, 0),
                position: new Polar(0, 0),
                dockAngle: 0
              }
              const videoSlot = {
                formationSlotId: -1,
                formation: args.formation,
                formationSlot: dummyFormationSlot,
                planeId: slotData[0] ? slotData[0].planeId : -1,
                plane: plane,
                planeSlotId: plane.videoId,
                byPlaneSlotId: -1
              }

              if (plane.hasVideo) {
                return {
                  plane,
                  slotData: [...slotData, videoSlot]
                }
              } else {
                return { plane, slotData }
              }
            })

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
              //draw each plane frame
              planeDrawers[plane.type].draw(d3.select(nodes[i]), t)
            })
            .attr("transform", "translate(0,0) scale(0)"),
        undefined,
        exit => transitionOut(exit, t)
      )
      .transition(t)
      .attr(
        "transform",
        ({ plane: { position } }) =>
          `translate(${p2c.get(position)!.x},${p2c.get(position)!.y}) scale(1)` //transition planes from center
      )
      .selection()
      .selectAll<SVGGElement, SlotData>("g.slot")
      .data(
        d => d.slotData,
        d => `${d.formationSlotId}.${d.planeId}.${d.plane.type}`
      )
      .join(
        addSlot, //add slots on enter without initial coordinates or label
        undefined,
        exit => transitionOut(exit, t)
      )
      .transition(t)
      .attr("transform", "scale(1)")
      .call(slotG => {
        updateSlot(slotG, planeX, planeY, fill, planeLabel(label))
      })

    const labelBox = drawLabel(
      this.group,
      args.formation,
      t,
      labelCoord,
      args.viewConfig.show
    )

    return slotsByPlane.reduce((box, { plane }) => {
      return box.union(
        planeDrawers[plane.type].box.translate(p2c.get(plane.position)!)
      )
    }, labelBox)
  }
}
