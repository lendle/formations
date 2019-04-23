export default interface Drawer<Args, ReturnArgs> {
  group: d3.Selection<SVGGElement, {}, null, undefined>
  withGroup(element: d3.Selection<SVGGElement, {}, null, undefined>): this
  draw(args: Args, transition: any | undefined): ReturnArgs
}
