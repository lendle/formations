import { connect } from 'react-redux'

import ConfigSidebar from './ConfigSidebar'
import { formationSlots, setPlaneType, setPlaneSlots, setPlaneSlotting, setColorBy, setNumberBy } from '../store/actions';
import { getSlotOptions } from '../selectors';



const mapStateToProps = (state) => ({
    slotsOptions: getSlotOptions(state),
    planesConfig: state.planesConfig, 
    viewConfig: state.viewConfig
})

const mapDispatchToProps = dispatch => ({
    onFormationSlotsSet: slots => dispatch(formationSlots(slots)),
    onPlaneTypeSet: (plane, type) => dispatch(setPlaneType(plane, type)),
    onPlaneSlotsSet: (plane, slots) => dispatch(setPlaneSlots(plane, slots)),
    onPlaneSlottingSet: (plane, slotting) => dispatch(setPlaneSlotting(plane, slotting)),
    onSetColorBy: colorBy => dispatch(setColorBy(colorBy)),
    onSetNumberBy: numberBy => dispatch(setNumberBy(numberBy))
})


// ConfigSidebar.propTypes = {

//     onFormationViewSet: PropTypes.func.isRequired
// }

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConfigSidebar)