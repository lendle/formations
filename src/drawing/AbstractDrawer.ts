import Drawer from "./interfaces";

export default abstract class AbstractDrawer<Args> implements Drawer<Args> {
  
    protected grp!: d3.Selection<SVGGElement, {}, null, undefined>;

    setGrp(grp: d3.Selection<SVGGElement, {}, null, undefined>): void {
        this.grp = grp
    }

    abstract draw(args: Args): void
    
    update(args: Args): void {
        this.draw(args)
    }
}
