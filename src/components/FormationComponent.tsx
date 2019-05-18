import React from "react"
import * as d3 from "d3"
import "./FormationComponent.css"

import { Formation, Plane, SlotData } from "../formation/interfaces"
import PlanesDrawer from "../drawing/PlanesDrawer"
import { ViewConfigState } from "../store/types"
import FormationDrawer from "../drawing/FormationDrawer"
import { SlotDataFun } from "../drawing/slotdatafuns"
import { BaseType } from "d3"
import { Box } from "../geometry/Box"

type Transition = d3.Transition<BaseType, any, any, any>

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
  wrapper!: d3.Selection<SVGGElement, {}, null, undefined>
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
    this.wrapper = this.svg.append("g")
    this.allGrp = this.wrapper.append("g")

    this.zoom = d3
      .zoom<SVGSVGElement, {}>()
      .scaleExtent([0.25, 2])
      .on("zoom", () => this.wrapper.attr("transform", d3.event.transform))

    this.svg
      .call(this.zoom) //allows user zoom
      .call(this.zoom.translateBy, this.width() / 2, this.height() / 2) //set initial zoom  to center

    //bounding box
    // https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2

    const t = d3.transition().duration(1000) as Transition

    this.formationDrawer = new FormationDrawer().withGroup(
      this.allGrp.append("g")
    )
    this.planesDrawer = new PlanesDrawer().withGroup(this.allGrp.append("g"))

    const box = this.formationDrawer.draw(this.props, t)

    this.planesDrawer.draw(this.props, t)

    this.zoomToBox(box, t)
  }

  componentDidUpdate() {
    const t = d3.transition().duration(1000) as Transition
    const box = this.formationDrawer.draw(this.props, t)
    this.planesDrawer.draw(this.props, t)

    this.zoomToBox(box, t)
  }

  zoomToBox(box: Box, t: Transition) {
    this.allGrp
      .transition(t)
      .attr("transform", `translate(${-box.cx}, ${-box.cy})`)
    this.svg
      .transition(t)
      .call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(this.width() / 2, this.height() / 2)
          .scale(
            Math.min(this.width() / box.width, this.height() / box.height) *
              0.95
          )
      )
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
