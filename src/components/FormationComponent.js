import React from 'react'
import PropTypes from 'prop-types'

import './FormationComponent.css'

import * as d3 from 'd3'
import Formation from '../formation/Formation';

const SCALE_FACTOR = 80

const arcFun = ({ position, dockAngle }) => {
    const scaledPos = position.scale(SCALE_FACTOR)
    return d3.arc()
        .outerRadius(scaledPos.radius)
        .innerRadius(scaledPos.radius)
        .startAngle(scaledPos.d3theta - dockAngle)
        .endAngle(scaledPos.d3theta + dockAngle)
}

const arc = d => arcFun(d)()
const x = d => d.position.scale(SCALE_FACTOR).x
const y = d => d.position.scale(SCALE_FACTOR).y
const translate = d => `translate(${d.offset.scale(SCALE_FACTOR).x},${d.offset.scale(SCALE_FACTOR).y})`

/**
 * 
 * @param g a selection (of g)
 * @param fill function mapping slotData to a fill color
 * @param label function mapping slotData to a label
 */
const addSlot = (g, fill, label) => {
    g.append("path")
        .attr("class", "grips")
        .attr("d", arc)

    g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 16)
        .style("fill", d => fill(d))

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
const transitionSlot = (g, fill, label, oldData) => {
    function changed(d) {
        const old = oldData.get(this, d)
        return x(d) !== x(old) || y(d) !== y(old)
    }
    const changedSlots = []

    g.filter(changed).each(d => changedSlots.push(d.slotNum))

    const delays = changedSlots.sort().reduce((acc, s, i) => { acc[s] = i; return acc }, {})

    const gg = g.delay(d => delays[d.slotNum] * 10 || 0)
    gg.attr("transform", d => translate(d) + " scale(1)")

    gg.select("path")
        .attr("d", arc)

    gg.select("circle")
        .attr("cx", x)
        .attr("cy", y)
        .style("fill", fill)

    gg.select("text")
        .attr("x", x)
        .attr("y", y)
        .text(label)
}

export default class FormationComponent extends React.Component {
    showFormation() {
        const { formation, viewConfig: { colorBy, numberBy } } = this.props

        const slotData = formation.allSlotData()

        const oldData = d3.local()

        const numColors = new Set(slotData.map(d => d.buildOrder)).size

        const buildOrderFill = (d) => d3.scaleOrdinal(d3.schemePaired).domain(d3.range(numColors))(d.buildOrder - 1)
        const planeFill = (d) => d3.scaleOrdinal(d3.schemePaired.filter((_, i) => [0, 2, 4].includes(i))).domain(["left", "rt", "lt"])(d.plane)

        const fills = {
            DEFAULT: () => null,
            BUILD_ORDER: buildOrderFill,
            PLANE: planeFill
        }

        const fill = fills[colorBy]

        const labels = {
            SLOT_NUM: d => d.slotNum + 1,
            BUILD_ORDER: d => d.buildOrder
        }

        const label = labels[numberBy]

        const slotGroups = this.formationGrp.selectAll("g.slot")
            .each(function (d) { oldData.set(this, d) })
            .data(slotData, d => d.slotNum)

        const t = d3.transition().duration(1000)

        slotGroups
            .transition(t)
            .call(transitionSlot, fill, label, oldData)

        slotGroups.enter().append("g")
            .attr("class", "slot")
            .attr("transform", () => "translate(0,0) scale(0)")
            .transition(t)
            .attr("transform", d => translate(d) + " scale(1)")
            .selection()
            .call(addSlot, fill, label)



        slotGroups.exit().transition(t)
            .attr("transform", "translate(0,0) scale(0)")
            .remove()

        this.formationGrp.node().getBBox()


        const r = formation.components
            .flatMap(c => d3.range(c.slots).map(s => c.slotPosition(s, true)))
            .reduce((m, p) => Math.max(m, p.radius), 0)

        

        const s =(Math.min(this.height(), this.width())/2)/((r+0.5))/94
        
        this.svg.transition(t).call(this.zoom.scaleTo, s)
        this.svg.transition(t).call(this.zoom.translateTo, 0,0) //recenters on update
        
    }

    zoomed() {
        this.formationGrp.attr("transform", d3.event.transform);
    }

    height() {
        return parseInt(this.svg.style('height'), 10)
    }

    width() {
        return parseInt(this.svg.style('width'), 10)
    }

    componentDidMount() {
        this.formationGrp = this.svg.append("g")
        this.zoom = d3.zoom()
            .scaleExtent([.5, 2])
            .on("zoom", () => this.zoomed())
        
        this.svg.call(this.zoom) //allows user zoom
                .call(this.zoom.translateBy, this.width() / 2, this.height() / 2) //translates to center

        
    
        // https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
        
        this.showFormation()
    }

    componentDidUpdate() {
        

        this.showFormation()
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
FormationComponent.propTypes = {
    formation: PropTypes.instanceOf(Formation),
    viewConfig: PropTypes.object
}
