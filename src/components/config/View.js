import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon } from "semantic-ui-react";
import { ColorOption, NumberOption } from '../../store/types';
import { setColorBy, setNumberBy } from '../../store/actions';



const View = props => {
    const { viewConfig, onSetColorBy, onSetNumberBy } = props

    const trigger = <span><Icon name='eye' /> <strong>View</strong></span>

    const colorBys = [
        { opt: ColorOption.DEFAULT, desc: 'Default' },
        { opt: ColorOption.PLANE, desc: 'Plane' },
        { opt: ColorOption.BUILD_ORDER, desc: 'Build Order' }
    ].map(({ opt, desc }) =>
        <Dropdown.Item key={opt} onClick={() => onSetColorBy(opt)} active={viewConfig.colorBy === opt} >{desc}</Dropdown.Item>)


    const numberBys = [
        { opt: NumberOption.SLOT_NUM, desc: 'Slot Number' },
        { opt: NumberOption.BUILD_ORDER, desc: 'Build Order' }
    ].map(({opt, desc}) => 
        <Dropdown.Item key={opt} onClick={() => onSetNumberBy(opt)} active={viewConfig.numberBy === opt} >{desc}</Dropdown.Item>)
    


    return <Dropdown trigger={trigger} item>
        <Dropdown.Menu>
            <Dropdown.Header>Color by</Dropdown.Header>
            {colorBys}
            <Dropdown.Divider />
            <Dropdown.Header>Number by</Dropdown.Header>
            {numberBys}
        </Dropdown.Menu>
    </Dropdown>
}


const mapStateToProps = (state) => ({
    viewConfig: state.viewConfig,
})

const mapDispatchToProps = dispatch => ({
    onSetColorBy: colorBy => dispatch(setColorBy(colorBy)),
    onSetNumberBy: numberBy => dispatch(setNumberBy(numberBy))
})


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View)