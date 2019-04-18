import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon } from "semantic-ui-react";
import { getSlotOptions } from '../../selectors';
import { formationSlots, baseSize } from '../../actions';

const trigger = slots => <span>
    <Icon name='users' /> <strong>Slots:</strong> {slots}
</span>

const Slots = props => {
    const { slotsOptions: { min, max, slots }, baseSize, onFormationSlotsSet, onBaseSizeSet } = props

    return <Dropdown trigger={trigger(slots)} pointing className='link item'>
        <Dropdown.Menu>
            <Dropdown.Item>
                <span>{min} </span>
                <input type="range" value={slots} min={min} max={max}
                    onChange={e => onFormationSlotsSet(e.target.value)} />
                <span> {max}</span>
            </Dropdown.Item>
            <Dropdown.Item>
                <Dropdown trigger={<span><strong>Base Size</strong>: {baseSize}</span>}>
                    <Dropdown.Menu>
                        {[4, 6, 8, 10].map(bs =>
                            <Dropdown.Item key={bs} onClick={() => onBaseSizeSet(bs)} active={baseSize === bs}>
                                {bs}
                            </Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
}


const mapStateToProps = (state) => ({
    slotsOptions: getSlotOptions(state),
    baseSize: state.formationConfig.baseSize
})

const mapDispatchToProps = dispatch => ({
    onFormationSlotsSet: slots => dispatch(formationSlots(slots)),
    onBaseSizeSet: size => dispatch(baseSize(size))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Slots)