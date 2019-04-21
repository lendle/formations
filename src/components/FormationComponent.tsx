import React from 'react'
import * as d3 from 'd3'
import './FormationComponent.css'


import { Formation, Plane, Slot } from '../formation/interfaces'
import FormationDrawer from '../drawing/FormationDrawer';
import PlanesDrawer from '../drawing/PlanesDrawer';

interface FormationProps {
    formation: Formation,
    planes: Plane[],
    slots: Slot[],
    viewConfig: { colorBy: string, numberBy: string }
}
export default class FormationComponent extends React.Component<FormationProps, {}>  {
    svg!: d3.Selection<SVGSVGElement | null, {}, null, undefined>;
    allGrp!: d3.Selection<SVGGElement, {}, null, undefined>;
    zoom!: d3.ZoomBehavior<Element, {}>;
    formationDrawer!: FormationDrawer;
    planesDrawer!: PlanesDrawer;


    height() {
        return parseInt(this.svg.style('height'), 10)
    }

    width() {
        return parseInt(this.svg.style('width'), 10)
    }

    componentDidMount() {
        this.allGrp = this.svg.append("g")

        this.zoom = d3.zoom()
            .scaleExtent([.5, 2])
            .on("zoom", () => this.allGrp.attr("transform", d3.event.transform))

        this.svg.call(this.zoom as any) //allows user zoom
                .call(this.zoom.translateBy as any, this.width() / 2, this.height() / 2) //set initial zoom  to center


        //bounding box
        // https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
        
        this.formationDrawer = new FormationDrawer()
        this.formationDrawer.setGrp(this.allGrp.append("g"))
        this.formationDrawer.draw(this.props)
        // this.planesDrawer = new PlanesDrawer()
        // this.planesDrawer.setGrp(this.allGrp.append("g"))
        // this.planesDrawer.draw(this.props)
        

    }

    componentDidUpdate() {
        this.formationDrawer.draw(this.props)
        // this.planesDrawer.draw(this.props)

    }

    componentWillUnmount() {
        // window.removeEventListener('resize', this.showFormation().bind(this));
    }

    render() {
        return <svg
            width={"100%"}
            height={"100%"}
            ref={element => (this.svg = d3.select(element))}
        />
    }

}

