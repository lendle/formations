import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon } from "semantic-ui-react";
import { setPlaneType, setPlaneSlots, setPlaneSlotting, PlaneTypes, SlottingOptions } from '../../actions';





const PlaneMenu = ({ planeConfig, setters }) => {
    const { plane, label, slotting, type, slots } = planeConfig
    const { onPlaneSlottingSet, onPlaneTypeSet, onPlaneSlotsSet } = setters
    const trigger = <div><strong>{label}</strong>: {type}{type !== PlaneTypes.NONE ? `, ${slots} slots, ${slotting === SlottingOptions.FILL ? 'filled' : 'slotted evenly'}` : null}</div>

    const types = plane === 'lead' ? [PlaneTypes.OTTER, PlaneTypes.SKYVAN] : [PlaneTypes.OTTER, PlaneTypes.SKYVAN, PlaneTypes.NONE]

    const { FILL, SPLIT } = SlottingOptions
    const slottingDescriptions = {
        [FILL]: 'Fill plane',
        [SPLIT]: 'Split evenly'
    }
    const slottings = [SPLIT, FILL]

    return (
        <Dropdown.Item>
            <Dropdown trigger={trigger} fluid>
                <Dropdown.Menu>
                    <Dropdown.Header>Type</Dropdown.Header>
                    {types.map(t =>
                        <Dropdown.Item key={t} onClick={() => onPlaneTypeSet(plane, t)} active={type===t}>
                            {t}
                        </Dropdown.Item>)
                    }
                    <Dropdown.Divider />
                    <Dropdown.Header>Slotting</Dropdown.Header>
                    {slottings.map(s =>
                        <Dropdown.Item key={s} onClick={() => onPlaneSlottingSet(plane, s)} active={slotting===s}>
                            {slottingDescriptions[s]}
                        </Dropdown.Item>)
                    }
                    <Dropdown.Divider />
                    <Dropdown.Header>Slots: {slots}</Dropdown.Header>
                    <Dropdown.Item>
                        <span>0 </span>
                        <input type="range" value={slots} min={0} max={30}
                            onChange={e => onPlaneSlotsSet(plane, parseInt(e.target.value))} />
                        <span> {30}</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Dropdown.Item>
    )
}

const Planes = props => {
    const { planesConfig, setters } = props

    const numPlanes = planesConfig.filter(({ type }) => type !== PlaneTypes.NONE).length

    const trigger = <span><Icon name='plane'/> <strong>Planes:</strong> {numPlanes}</span>

    return <Dropdown trigger={trigger} item>
        <Dropdown.Menu>
            {planesConfig.map(planeConfig => <PlaneMenu key={planeConfig.plane} planeConfig={planeConfig} setters={setters} />)}
        </Dropdown.Menu>
    </Dropdown>
}


const mapStateToProps = (state) => ({
    planesConfig: state.planesConfig,
})

const mapDispatchToProps = dispatch => ({
    setters: {
        onPlaneTypeSet: (plane, type) => dispatch(setPlaneType(plane, type)),
        onPlaneSlotsSet: (plane, slots) => dispatch(setPlaneSlots(plane, slots)),
        onPlaneSlottingSet: (plane, slotting) => dispatch(setPlaneSlotting(plane, slotting)),
    }
})


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Planes)