import React from "react"
import * as d3 from "d3"
import "./FormationComponent.css"

import { Formation, Plane, SlotData } from "../formation/interfaces"
import PlanesDrawer from "../drawing/PlanesDrawer"
import { ViewConfigState } from "../store/types"
import FormationDrawer from "../drawing/FormationDrawer"
import { SlotDataFun } from "../drawing/slotdatafuns"
import { Transition, BaseType } from "d3"

interface FormationProps {
  formation: Formation
  planes: Plane[]
  slots: SlotData[]
  viewConfig: ViewConfigState
  fill: SlotDataFun
  label: SlotDataFun
}
export default class FormationComponent extends React.Component<
  FormationProps,
  {}
> {
  svg!: d3.Selection<SVGSVGElement, {}, null, undefined>
  allGrp!: d3.Selection<SVGGElement, {}, null, undefined>
  zoom!: d3.ZoomBehavior<SVGSVGElement, {}>
  formationDrawer!: FormationDrawer
  planesDrawer!: PlanesDrawer

  height() {
    return parseInt(this.svg.style("height"), 10)
  }

  width() {
    return parseInt(this.svg.style("width"), 10)
  }

  componentDidMount() {
    this.allGrp = this.svg.append("g")

    this.zoom = d3
      .zoom<SVGSVGElement, {}>()
      .scaleExtent([0.5, 2])
      .on("zoom", () => this.allGrp.attr("transform", d3.event.transform))

    this.svg
      .call(this.zoom) //allows user zoom
      .call(this.zoom.translateBy, this.width() / 2, this.height() / 2) //set initial zoom  to center

    //bounding box
    // https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2

    const t = d3.transition().duration(1000) as Transition<
      BaseType,
      any,
      any,
      any
    >

    this.formationDrawer = new FormationDrawer().withGroup(
      this.allGrp.append("g")
    )

    this.formationDrawer.draw(this.props, t)

    this.planesDrawer = new PlanesDrawer().withGroup(this.allGrp.append("g"))
    this.planesDrawer.draw(this.props, t)
  }

  componentDidUpdate() {
    const t = d3.transition().duration(1000) as Transition<
      BaseType,
      any,
      any,
      any
    >
    this.formationDrawer.draw(this.props, t)
    this.planesDrawer.draw(this.props, t)
  }

  render() {
    return (
      <svg
        width={"100%"}
        height={"100%"}
        ref={element => (this.svg = d3.select(element!))}
      />
    )
  }
}
