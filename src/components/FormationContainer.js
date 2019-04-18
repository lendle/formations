import { connect } from 'react-redux'
import FormationComponent from './FormationComponent';
import debounceRender from 'react-debounce-render'
import { getFormation } from '../selectors'

const mapStateToProps = (state) => ({
    formation: getFormation(state),
    viewConfig: state.viewConfig
})

export default connect(
    mapStateToProps
)(debounceRender(FormationComponent, 100))