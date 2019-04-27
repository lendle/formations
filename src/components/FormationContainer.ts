import { connect } from "react-redux"
import FormationComponent from "./FormationComponent"
import { getFormation, getPlanes, getAllSlots } from "../selectors"
import { AppState } from "../store/reducer"
import { FILL_FUNCTIONS, LABEL_FUNCTIONS } from "../drawing/slotdatafuns"

const mapStateToProps = (state: AppState) => ({
  formation: getFormation(state),
  planes: getPlanes(state),
  slots: getAllSlots(state),
  viewConfig: state.viewConfig,
  fill: FILL_FUNCTIONS[state.viewConfig.colorBy],
  label: LABEL_FUNCTIONS[state.viewConfig.numberBy]
})

export default connect(mapStateToProps)(FormationComponent)

// console.log({debounceRender})

// export default connect(
//     mapStateToProps
// )(debounceRender.debounceRender(FormationComponent, 100))
