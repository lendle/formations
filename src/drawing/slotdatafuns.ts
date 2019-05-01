import { SlotData } from "../formation/interfaces"
import * as d3 from "d3"
import PlanePosition from "../formation/PlanePosition"
import { SCALE_FACTOR, TAU, PI } from "../constants"
import { BaseType } from "d3"
import { ColorOption, NumberOption, FormationType } from "../store/types"
import { planeDrawers } from "./planedrawers"
import Polar from "../geometry/Polar"

export type SlotDataFun = (d: SlotData) => any

const stringRange = (stop: number): string[] =>
  d3.range(stop).map(x => x.toString())

const buildOrderFill = ({ formationSlot: { buildOrder } }: SlotData) =>
  d3.scaleOrdinal(d3.schemePaired).domain(stringRange(12))(
    (buildOrder - 1).toString()
  )
const planeFill = (d: SlotData) =>
  d3
    .scaleOrdinal(d3.schemePaired.filter((_, i) => [0, 2, 4].includes(i)))
    .domain([PlanePosition.LEAD, PlanePosition.LT, PlanePosition.RT])(
    d.plane.position
  )

const radialFill = ({ formationSlot }: SlotData) => {
  const theta = formationSlot.offset.plus(formationSlot.position).theta / TAU
  return d3.interpolateRainbow(theta)
}

export const fillFunction = (colorBy: ColorOption): SlotDataFun => {
  switch (colorBy) {
    case ColorOption.BUILD_ORDER:
      return buildOrderFill
    case ColorOption.PLANE:
      return planeFill
    case ColorOption.RADIAL:
      return radialFill
    default:
      return () => null
  }
}

export const labelFunction = (numberBy: NumberOption) => {
  switch (numberBy) {
    case NumberOption.BUILD_ORDER:
      return (d: SlotData) => d.formationSlot.buildOrder
    case NumberOption.SLOT_NUM_BY_PLANE:
      return (d: SlotData) => d.byPlaneSlotId + 1
    default:
      return (d: SlotData) => d.formationSlotId + 1
  }
}

/**
 * wraps label, replacing label with "B" for base slots
 * @param label label function
 */
export const baseLabel = (label: SlotDataFun) => (d: SlotData) =>
  d.formation.baseIds.includes(d.formationSlotId) ? "B" : label(d)

const scaledCoord = (point: Polar, type: FormationType) =>
  (type === FormationType.HD ? point.flip(PI / 2) : point).scale(SCALE_FACTOR)

const scaledPosition = ({
  formationSlot: { position },
  formation: { type }
}: SlotData) => scaledCoord(position, type)

const scaledOffset = ({
  formationSlot: { offset },
  formation: { type }
}: SlotData) => scaledCoord(offset, type)

export const arc = (d: SlotData) => {
  const scaledPos = scaledPosition(d)
  const dockAngle = d.formationSlot.dockAngle
  return d3.arc()({
    outerRadius: scaledPos.radius,
    innerRadius: scaledPos.radius,
    startAngle: scaledPos.d3theta - dockAngle,
    endAngle: scaledPos.d3theta + dockAngle
  })
}

export const x = (d: SlotData) => scaledPosition(d).x
export const y = (d: SlotData) => scaledPosition(d).y
export const translate = (d: SlotData) =>
  `translate(${scaledOffset(d).x},${scaledOffset(d).y})`

export const planeX = (d: SlotData) => planeDrawers[d.plane.type].x(d)
export const planeY = (d: SlotData) => planeDrawers[d.plane.type].y(d)

export const FORMATION_SCALE_FACTOR = 40

export const highlight = (d: SlotData) => {
  d3.selectAll(`[formationSlotId="${d.formationSlotId}"].slot circle`)
    .transition()
    .ease(d3.easeBack.overshoot(3))
    .attr("r", 20)
}
export const unhighlight = (d: SlotData) => {
  d3.selectAll(`[formationSlotId="${d.formationSlotId}"].slot circle`)
    .transition()
    .ease(d3.easeBack.overshoot(3))
    .attr("r", 16)
}

export const addSlotGroup = <E extends BaseType>(
  selection: d3.Selection<E, SlotData, SVGGElement, any>,
  x: SlotDataFun,
  y: SlotDataFun,
  fill: SlotDataFun,
  label: SlotDataFun
) => {
  return selection
    .append("g")
    .classed("slot", true)
    .on("mouseover", highlight)
    .on("mouseout", unhighlight)
    .attr("formationSlotId", d => d.formationSlotId)
    .call(slotG =>
      slotG
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 16)
        .attr("fill", fill)
    )
    .call(slotG =>
      slotG
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("x", x)
        .attr("y", y)
        .text(label)
    )
}

export const addSlot = <E extends BaseType>(
  g: d3.Selection<E, SlotData, SVGGElement, any>,
  x?: SlotDataFun,
  y?: SlotDataFun,
  fill?: SlotDataFun,
  label?: SlotDataFun
) => {
  return g
    .append("g")
    .classed("slot", true)
    .on("mouseover", highlight)
    .on("mouseout", unhighlight)
    .attr("formationSlotId", d => d.formationSlotId)
    .call(slotG => {
      slotG
        .append("circle")
        .attr("r", 16)
        .call(circle => {
          x && circle.attr("cx", x)
          y && circle.attr("cy", y)
          fill && circle.attr("fill", fill)
        })
      slotG
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .call(text => {
          x && text.attr("x", x)
          y && text.attr("y", y)
          label && text.text(label)
        })
    })
}

export const updateSlot = (
  g: d3.Transition<SVGGElement, SlotData, SVGGElement, {}>,
  x: SlotDataFun,
  y: SlotDataFun,
  fill: SlotDataFun,
  label: SlotDataFun
) => {
  g.select("g.slot circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("fill", fill)

  g.select("g.slot text")
    .attr("x", x)
    .attr("y", y)
    .text(label)
}

export const transitionOut = (
  exit: d3.Selection<SVGGElement, any, SVGGElement, any>,
  t: d3.Transition<BaseType, any, any, any>
) =>
  exit
    .transition(t)
    .attr("transform", "scale(0)")
    .remove()
