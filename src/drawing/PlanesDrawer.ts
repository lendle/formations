import { Plane, Slot } from "../formation/interfaces";
import AbstractDrawer from "./AbstractDrawer";
import * as d3 from 'd3'
import PlanePosition from "../formation/PlanePosition";


interface PlanesArgs {
    slots: Slot[]
    planes: Plane[]
}

type XY = {
    x: number
    y: number
}

const w = 1.5
const l = 6
const x = (d: XY) => d.x * 40
const y = (d: XY) => d.y * 40



const otterPoints = [{ x: -w, y: -l },
{ x: w, y: -l },
{ x: w, y: l },
{ x: -w, y: l },
{ x: -w, y: -l }]

const doorPoints = [{ x: -w, y: l - 6 },
{ x: -w, y: l - 2 }]

const floaters = d3.range(7).map(y => ({ x: -2, y: l - 0.5 - y }))
const inDoor = d3.range(3).map(y => ({ x: -1, y: l - 3 - y }))
const inDoor2 = d3.range(2).map(y => ({ x: 0, y: l - 3.5 - y }))
const divers = d3.range(5).flatMap(y => [{ x: -0.5, y: -0.5 - y }, { x: 0.5, y: -0.5 - y }])
const otterSlots = [...floaters, ...inDoor, ...inDoor2, ...divers]

const line = d3.line<XY>().x(x).y(y)

/**
 * 
 * @param g a selection (of g)
 * @param fill function mapping slotData to a fill color
 * @param label function mapping slotData to a label
 */
const addPlane = (g: d3.Selection<SVGGElement, Plane, SVGGElement, {}>, positionToOffest: Map<PlanePosition, number>) => {
    g.append('path')
        .attr("stroke", "black")
        .attr("d", line(otterPoints)!)

    g.append('path')
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("d", line(doorPoints)!)

    const slotsG = g.selectAll<SVGGElement, XY>('circle')
        .data(({ filledSlots }) => otterSlots.slice(0, filledSlots))

    slotsG.enter()
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 16)

    slotsG.exit()
        .remove()

    g.append('text')
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("x", 0)
        .attr("y", -220)
        .text(({ position }) => position)
        .attr('fill', 'black')


    g.attr("transform", ({ position }) => `translate(${positionToOffest.get(position)}, 0)`)

}

export default class PlanesDrawer extends AbstractDrawer<PlanesArgs> {


    draw({ planes }: PlanesArgs): void {
        const positions = planes.map(p => p.position)
        const positionToOffest = new Map(
            [PlanePosition.LT, PlanePosition.LEAD, PlanePosition.RT]
                .filter(p => positions.includes(p))
                .map((p, idx, all) => [p, idx * 300 - ((all.length - 1) * 150)])
        )

        const planeGrps = this.grp.selectAll<SVGGElement, Plane>("g.plane")
            .data<Plane>(planes, plane => plane.position)

        planeGrps.call(addPlane, positionToOffest)
        planeGrps.enter()
            .append("g")
            .attr("class", "plane")
            .call(addPlane, positionToOffest)

        planeGrps.exit().remove()
    }
}




//     protected computeSlots(): PlaneSlot[] {


//     }