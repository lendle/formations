export default interface Drawer<Args> {
    setGrp(element: d3.Selection<SVGGElement, {}, null, undefined>): void

    draw(args: Args): void
    update(args: Args): void
}