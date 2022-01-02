/* eslint-disable @typescript-eslint/ban-types */
import { Drawer } from "./interfaces"

export default abstract class AbstractDrawer<Args, ReturnArgs>
  implements Drawer<Args, ReturnArgs> {
  group!: d3.Selection<SVGGElement, unknown, null, undefined>

  withGroup(group: d3.Selection<SVGGElement, unknown, null, undefined>): this {
    this.group = group
    return this
  }

  abstract draw(args: Args, transition: any): ReturnArgs
}
