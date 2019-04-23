import {
  Plane,
  Formation,
  Slot,
  FormationSlot,
  NumDict
} from "../formation/interfaces"
import PlanePosition from "../formation/PlanePosition"
import * as d3 from "d3"
import AbstractDrawer from "./AbstractDrawer"
import { ViewConfigState, ShowOption } from "../store/types"
import { SCALE_FACTOR } from "../constants"

interface SlotData extends FormationSlot {
  slotNum: number
  plane: PlanePosition
}

type StringDict<V> = { [index: string]: V }

type SlotDataFun = (d: SlotData) => any

const stringRange = (stop: number): string[] =>
  d3.range(stop).map(x => x.toString())

const arc = ({ position, dockAngle }: SlotData) => {
  const scaledPos = position.scale(SCALE_FACTOR)
  return d3.arc()({
    outerRadius: scaledPos.radius,
    innerRadius: scaledPos.radius,
    startAngle: scaledPos.d3theta - dockAngle,
    endAngle: scaledPos.d3theta + dockAngle
  })
}

// const arc = (d: SlotData) => arcFun(d)()
const x = (d: SlotData) => d.position.scale(SCALE_FACTOR).x
const y = (d: SlotData) => d.position.scale(SCALE_FACTOR).y
const translate = (d: SlotData) =>
  `translate(${d.offset.scale(SCALE_FACTOR).x},${
    d.offset.scale(SCALE_FACTOR).y
  })`

/**
 *
 * @param g a selection (of g)
 * @param fill function mapping slotData to a fill color
 * @param label function mapping slotData to a label
 */
const addSlot = (
  g: d3.Selection<SVGGElement, SlotData, SVGGElement, {}>,
  fill: SlotDataFun,
  label: SlotDataFun
) => {
  g.append("path")
    .attr("class", "grips")
    .attr("d", arc)

  g.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 16)
    .style("fill", (d: SlotData) => fill(d))

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", x)
    .attr("y", y)
    .text(label)
}

/**
 *
 * @param g a selection (of g)
 * @param fill function mapping slotData to a fill color
 * @param label function mapping slotData to a label
 * @param oldData a d3.local of values of data before transition
 */
const transitionSlot = (
  g: d3.Transition<SVGGElement, SlotData, SVGGElement, {}>,
  fill: SlotDataFun,
  label: SlotDataFun,
  oldData: d3.Local<SlotData>
) => {
  const changed = (
    d: SlotData,
    i: number,
    nodes: ArrayLike<SVGGElement>
  ): boolean => {
    const old = oldData.get(nodes[i])!
    return x(d) !== x(old) || y(d) !== y(old)
  }
  const changedSlots = [] as number[]

  g.filter(changed).each(({ slotNum }) => changedSlots.push(slotNum))

  const delays = changedSlots.sort().reduce(
    (acc, s, i) => {
      acc[s] = i
      return acc
    },
    {} as NumDict<number>
  )

  const gg = g.delay((d: SlotData) => delays[d.slotNum] * 10 || 0)
  gg.attr("transform", (d: SlotData) => translate(d) + " scale(1)")

  gg.select("path").attr("d", arc)

  gg.select("circle")
    .attr("cx", x)
    .attr("cy", y)
    .style("fill", fill)

  gg.select("text")
    .attr("x", x)
    .attr("y", y)
    .text(label)
}

interface FormationArgs {
  slots: Slot[]
  formation: Formation
  planes: Plane[]
  viewConfig: ViewConfigState
}
export default class FormationDrawer extends AbstractDrawer<
  FormationArgs,
  void
> {
  draw({
    formation,
    planes,
    slots,
    viewConfig: { colorBy, numberBy, show }
  }: FormationArgs) {
    const slotData: SlotData[] =
      show === ShowOption.PLANES
        ? []
        : slots.map(({ formationSlotId, planeId }) => ({
            slotNum: formationSlotId,
            ...formation.slots[formationSlotId],
            plane: planes[planeId].position
          }))

    const numColors = new Set(slotData.map((d: SlotData) => d.buildOrder)).size

    const buildOrderFill = (d: SlotData) =>
      d3.scaleOrdinal(d3.schemePaired).domain(stringRange(numColors))(
        (d.buildOrder - 1).toString()
      )
    const planeFill = (d: SlotData) =>
      d3
        .scaleOrdinal(d3.schemePaired.filter((_, i) => [0, 2, 4].includes(i)))
        .domain([PlanePosition.LEAD, PlanePosition.LT, PlanePosition.RT])(
        d.plane
      )

    const fills: StringDict<SlotDataFun> = {
      DEFAULT: () => null,
      BUILD_ORDER: buildOrderFill,
      PLANE: planeFill
    }

    const fill = fills[colorBy]

    const labels: StringDict<SlotDataFun> = {
      SLOT_NUM: (d: SlotData) => d.slotNum + 1,
      BUILD_ORDER: (d: SlotData) => d.buildOrder
    }

    const label = labels[numberBy]

    const oldData = d3.local() as d3.Local<SlotData>

    const slotGroups = this.group
      .selectAll<SVGGElement, SlotData>("g.slot")
      .each((d, i, nodes) => {
        oldData.set(nodes[i], d)
      })
      .data<SlotData>(slotData, d => d.slotNum.toString())
    // .data<SlotData>(slotData, d=> d.slotNum)
    // (slotData, ((d: SlotData) => d.slotNum))

    const t = d3.transition().duration(1000)

    slotGroups.transition(t as any).call(transitionSlot, fill, label, oldData)

    slotGroups
      .enter()
      .append("g")
      .attr("class", "slot")
      .attr("transform", "translate(0,0) scale(0)")
      .transition(t as any)
      .attr("transform", (d: SlotData) => translate(d) + " scale(1)")
      .selection()
      .call(addSlot, fill, label)

    slotGroups
      .exit()
      .transition(t as any)
      .attr("transform", "translate(0,0) scale(0)")
      .remove()

    // const s = (Math.min(this.height(), this.width()) / 2) / ((formation.radius + 0.5)) / 94

    // // d3.zoomIdentity.translate()
    // const recenter = d3.zoomTransform(this.svg as any)
    //     .translate(this.width() / 2, this.height() / 2)
    //     .scale(s)
    // this.svg.transition(t as any).call(this.zoom.transform as any, recenter)
  }
}
