import { connect } from 'react-redux'
import FormationComponent from './FormationComponent';
import { getFormation, getPlanes, getAllSlots } from '../selectors';

//todo any
const mapStateToProps = (state: any) => ({
    formation: getFormation(state),
    planes: getPlanes(state),
    slots: getAllSlots(state),
    viewConfig: state.viewConfig
})


export default connect(
    mapStateToProps
)(FormationComponent)

// console.log({debounceRender})

// export default connect(
//     mapStateToProps
// )(debounceRender.debounceRender(FormationComponent, 100))