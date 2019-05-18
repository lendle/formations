import { SlotData } from "../formation/interfaces"
import AbstractDrawer from "./AbstractDrawer"
import { ViewConfigState, ShowOption, FormationType } from "../store/types"
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
import { SCALE_FACTOR } from "../constants"
import { Box } from "../geometry/Box"

interface FormationArgs {
  slots: SlotData[]
  viewConfig: ViewConfigState
  fill: SlotDataFun
  label: SlotDataFun
}
export default class FormationDrawer extends AbstractDrawer<
  FormationArgs,
  Box
> {
  draw(
    { slots, viewConfig, fill, label }: FormationArgs,
    t: Transition<BaseType, any, any, any>
  ) {
    const slotData: SlotData[] =
      viewConfig.show === ShowOption.PLANES ? [] : slots

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

    if (viewConfig.show === ShowOption.PLANES) {
      return new Box(-1, -1, 1, 1).scale(SCALE_FACTOR)
    }

    const box = slotData[0].formation.bbox.scale(SCALE_FACTOR)
    return slotData[0].formation.type === FormationType.HD ? box.flipX() : box
  }
}
