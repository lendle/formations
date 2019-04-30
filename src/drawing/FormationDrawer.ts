import { SlotData } from "../formation/interfaces"
import * as d3 from "d3"
import AbstractDrawer from "./AbstractDrawer"
import { ViewConfigState, ShowOption } from "../store/types"
import {
  x,
  y,
  translate,
  updateSlot,
  addSlot,
  arc,
  transitionOut,
  SlotDataFun
} from "./slotdatafuns"
import { Transition, BaseType } from "d3"

interface FormationArgs {
  slots: SlotData[]
  viewConfig: ViewConfigState
  fill: SlotDataFun
  label: SlotDataFun
}
export default class FormationDrawer extends AbstractDrawer<
  FormationArgs,
  void
> {
  draw({ slots, viewConfig, fill, label }: FormationArgs) {
    const slotData: SlotData[] =
      viewConfig.show === ShowOption.PLANES ? [] : slots

    const t = d3.transition().duration(1000) as Transition<
      BaseType,
      any,
      any,
      any
    >

    this.group
      .selectAll<SVGGElement, SlotData>("g.slotgroup")
      .data<SlotData>(slotData, d => d.formationSlotId.toString())
      .join(
        enter =>
          enter
            .append("g")
            .attr("class", "slotgroup") // slot plus grips
            .attr("transform", "translate(0,0) scale(0)") //start scaled down
            .call(g => {
              g.append("path") //add the grips path
                .attr("class", "grips")
                .attr("d", arc)
              addSlot(g, x, y, fill, label) //add the slot circle with fill
            }),
        undefined, //pass through, since we want to transition both new and old points
        exit => transitionOut(exit, t)
      )
      .transition(t)
      .attr("transform", d => translate(d) + " scale(1)") //scale up translate
      .call(g => {
        //basically a no op for data that just entered
        g.select("path").attr("d", arc)
        updateSlot(g, x, y, fill, label)
      })
  }
}
