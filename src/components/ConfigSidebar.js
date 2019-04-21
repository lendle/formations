import React from 'react'
import { Icon, Menu, Sidebar, Form, Divider, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { SlottingOptions, ColorOptions, NumberOptions, PlaneType } from '../store/actions';

const PlaneMenu = ({ planeInfo, onPlaneTypeSet, onPlaneSlotsSet, onPlaneSlottingSet }) => {
    const { plane, label, slotting, type, slots } = planeInfo

    const { NONE, OTTER, SKYVAN } = PlaneType
    const { SPLIT, FILL } = SlottingOptions

    return <Menu.Item>
        <Menu.Header>{label}</Menu.Header>
        <Form inverted>
            <label>Type </label>
            <Button.Group compact size="mini">
                {[NONE, OTTER, SKYVAN]
                .filter(t => plane !== "lead" || t !== NONE)
                .map((t, i) =>
                    <Button key={i} inverted color={type === t ? 'blue' : null} onClick={() => onPlaneTypeSet(plane, t)} content={t} />)
                }
            </Button.Group>
            <Divider hidden />
            <label>Slotting </label>
            <Button.Group compact size="mini">
                {[SPLIT, FILL]
                    .map((s, i) => <Button key={i} inverted color={slotting === s ? 'blue' : null} onClick={() => onPlaneSlottingSet(plane, s)} content={s} />)
                }
            </Button.Group>
            <Divider hidden />
            <Form.Input inline inverted label="Slots" type="number" min={0} size="mini" maxLength={2}
                value={slots}
                onChange={(e) => onPlaneSlotsSet(plane, e.target.value)}
            />
        </Form>
    </Menu.Item>
}

const ConfigSidebar = ({
    visible,
    slotsOptions,
    planesConfig,
    viewConfig,
    onFormationSlotsSet,
    onPlaneTypeSet,
    onPlaneSlotsSet,
    onPlaneSlottingSet,
    onSetColorBy,
    onSetNumberBy,
    onSidebarHide }) => {

    const planeMenus = planesConfig.map(plane => <PlaneMenu
        key={plane.label}
        planeInfo={plane}
        onPlaneSlotsSet={onPlaneSlotsSet}
        onPlaneSlottingSet={onPlaneSlottingSet}
        onPlaneTypeSet={onPlaneTypeSet} />
    ).reduce((acc, p, i) => i === 0 ? [p] : [...acc, <Divider key={"divider" + i}/>, p], [])

    return <Sidebar as={Menu}
        animation='scale down'
        inverted
        onHide={onSidebarHide}
        vertical
        visible={visible}
        width='wide'
    >
        <Menu.Item>
            <Menu.Header>Slots</Menu.Header>
            <Icon name='users' />
            <label>{slotsOptions.slots} </label>
            <input type="range" value={slotsOptions.slots} min={slotsOptions.min} max={slotsOptions.max}
                onChange={e => onFormationSlotsSet(e.target.value)} />
        </Menu.Item>
        <Menu.Item>
            <Menu.Header>Planes</Menu.Header>
            <Icon name='plane' />
            <Menu.Menu>
                {planeMenus}
            </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
            <Icon name='options' />
            <Menu.Header>View Options</Menu.Header>
            <Form inverted>
                <label>Color by </label>
                <Button.Group compact size="mini">
                    {
                        [ColorOptions.DEFAULT, ColorOptions.PLANE, ColorOptions.BUILD_ORDER]
                            .map((c, i) =>
                                <Button key={i} inverted color={viewConfig.colorBy === c ? 'blue' : null} onClick={() => onSetColorBy(c)} content={c} />)
                    }
                </Button.Group>
                <Divider hidden />
                <label>Number by </label>
                <Button.Group compact size="mini">
                    {
                        [NumberOptions.SLOT_NUM, NumberOptions.BUILD_ORDER]
                            .map((n, i) =>
                                <Button key={i} inverted color={viewConfig.numberBy === n ? 'blue' : null} onClick={() => onSetNumberBy(n)} content={n} />)
                    }
                </Button.Group>
            </Form>
        </Menu.Item>
    </Sidebar>
}

ConfigSidebar.propTypes = {
    visible: PropTypes.bool.isRequired,
    slotsOptions: PropTypes.shape({
        slots: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired
    }),
    planesConfig: PropTypes.arrayOf(PropTypes.shape({
        plane: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        slotting: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        slots: PropTypes.number.isRequired
    })).isRequired,
    viewConfig: PropTypes.object.isRequired, //TODO spec this out more
    onSidebarHide: PropTypes.func.isRequired,
    onFormationSlotsSet: PropTypes.func.isRequired,
    onPlaneTypeSet: PropTypes.func.isRequired,
    onPlaneSlottingSet: PropTypes.func.isRequired,
    onPlaneSlotsSet: PropTypes.func.isRequired,
    onSetColorBy: PropTypes.func.isRequired,
    onSetNumberBy: PropTypes.func.isRequired
}

export default ConfigSidebar