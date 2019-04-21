import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon } from "semantic-ui-react";
import { PlaneType, Slotting } from '../../store/types';
import { setPlaneType, setPlaneSlots } from '../../store/actions';



const PlaneMenu = ({ planeConfig, setters }) => {
    const { plane, label, slotting, type, slots } = planeConfig
    const { onPlaneSlottingSet, onPlaneTypeSet, onPlaneSlotsSet } = setters
    const trigger = <div><strong>{label}</strong>: {type}{type !== PlaneType.NONE ? `, ${slots} slots, ${slotting === Slotting.FILL ? 'filled' : 'slotted evenly'}` : null}</div>

    const types = plane === 'lead' ? [PlaneType.OTTER, PlaneType.SKYVAN] : [PlaneType.OTTER, PlaneType.SKYVAN, PlaneType.NONE]

    const { FILL, SPLIT } = Slotting
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
                        <Dropdown.Item key={t} onClick={() => onPlaneTypeSet(plane, t)} active={type === t}>
                            {t}
                        </Dropdown.Item>)
                    }
                    <Dropdown.Divider />
                    <Dropdown.Header>Slotting</Dropdown.Header>
                    {slottings.map(s =>
                        <Dropdown.Item key={s} onClick={() => onPlaneSlottingSet(plane, s)} active={slotting === s}>
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

    const numPlanes = planesConfig.filter(({ type }) => type !== PlaneType.NONE).length

    const trigger = <span><Icon name='plane' /> <strong>Planes:</strong> {numPlanes}</span>

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
        onPlaneSlottingSet: (plane, slotting) => dispatch(setPlaneSlots(plane, slotting)),
    }
})


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Planes)