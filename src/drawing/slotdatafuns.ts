import { SlotData } from "../formation/interfaces"
import * as d3 from "d3"
import PlanePosition from "../formation/PlanePosition"
import { SCALE_FACTOR } from "../constants"
import { BaseType } from "d3"

export type SlotDataFun = (d: SlotData) => any

type StringDict<V> = { [index: string]: V }

export const arc = ({ formationSlot: { position, dockAngle } }: SlotData) => {
  const scaledPos = position.scale(SCALE_FACTOR)
  return d3.arc()({
    outerRadius: scaledPos.radius,
    innerRadius: scaledPos.radius,
    startAngle: scaledPos.d3theta - dockAngle,
    endAngle: scaledPos.d3theta + dockAngle
  })
}

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

export const FILL_FUNCTIONS: StringDict<SlotDataFun> = {
  DEFAULT: () => null,
  BUILD_ORDER: buildOrderFill,
  PLANE: planeFill
}

export const LABEL_FUNCTIONS: StringDict<SlotDataFun> = {
  SLOT_NUM: (d: SlotData) => d.formationSlotId + 1,
  BUILD_ORDER: (d: SlotData) => d.formationSlot.buildOrder
}

// const arc = (d: SlotData) => arcFun(d)()
export const x = ({ formationSlot: { position } }: SlotData) =>
  position.scale(SCALE_FACTOR).x
export const y = ({ formationSlot: { position } }: SlotData) =>
  position.scale(SCALE_FACTOR).y
export const translate = ({ formationSlot: { offset } }: SlotData) =>
  `translate(${offset.scale(SCALE_FACTOR).x},${offset.scale(SCALE_FACTOR).y})`

export const planeX = (d: SlotData) => d.planeSlot.x * FORMATION_SCALE_FACTOR
export const planeY = (d: SlotData) => d.planeSlot.y * FORMATION_SCALE_FACTOR

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
