import React, { Dispatch } from "react"
import { connect } from "react-redux"
import { Dropdown, Icon } from "semantic-ui-react"
import {
  PlaneType,
  Slotting,
  PlanesConfigActionTypes,
  PlaneState
} from "../../store/types"
import {
  setPlaneType,
  setPlaneSlots,
  setPlaneSlotting
} from "../../store/actions"
import PlanePosition from "../../formation/PlanePosition"
import { AppState } from "../../store/reducer"

type Setters = {
  onPlaneTypeSet: (plane: PlanePosition, type: PlaneType) => void;
  onPlaneSlotsSet: (plane: PlanePosition, slots: number) => void;
  onPlaneSlottingSet: (plane: PlanePosition, slotting: Slotting) => void;
}

type PlaneMenuProps = {
  planeConfig: PlaneState;
  setters: Setters;
}

const typeDescriptions = {
  [PlaneType.OTTER]: "Otter",
  [PlaneType.SKYVAN]: "Skyvan",
  [PlaneType.NONE]: "None"
}

const PlaneMenu = (props: PlaneMenuProps) => {
  const { planeConfig, setters } = props
  const { position, label, slotting, type, slots } = planeConfig
  const { onPlaneSlottingSet, onPlaneTypeSet, onPlaneSlotsSet } = setters
  const trigger = (
    <div>
      <strong>{label}</strong>: {typeDescriptions[type]}
      {type !== PlaneType.NONE
        ? `, ${slots} slots, ${
            slotting === Slotting.FILL ? "filled" : "slotted evenly"
          }`
        : null}
    </div>
  )

  const types =
    position === PlanePosition.LEAD
      ? [PlaneType.OTTER, PlaneType.SKYVAN]
      : [PlaneType.OTTER, PlaneType.SKYVAN, PlaneType.NONE]

  const { FILL, SPLIT } = Slotting
  const slottingDescriptions = {
    [FILL]: "Fill plane",
    [SPLIT]: "Split evenly"
  }
  const slottings = [SPLIT, FILL]

  return (
    <Dropdown.Item>
      <Dropdown trigger={trigger} fluid>
        <Dropdown.Menu>
          <Dropdown.Header>Type</Dropdown.Header>
          {types.map(t => (
            <Dropdown.Item
              key={t}
              onClick={() => onPlaneTypeSet(position, t)}
              active={type === t}
            >
              {typeDescriptions[t]}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Header>Slotting</Dropdown.Header>
          {slottings.map(s => (
            <Dropdown.Item
              key={s}
              onClick={() => onPlaneSlottingSet(position, s)}
              active={slotting === s}
            >
              {slottingDescriptions[s]}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Header>Slots: {slots}</Dropdown.Header>
          <Dropdown.Item>
            <span>0 </span>
            <input
              type="range"
              value={slots}
              min={0}
              max={30}
              onChange={e =>
                onPlaneSlotsSet(position, parseInt(e.target.value))
              }
            />
            <span> {30}</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Dropdown.Item>
  )
}

type PlanesProps = {
  planesConfig: PlaneState[];
  setters: Setters;
}
const Planes = (props: PlanesProps) => {
  const { planesConfig, setters } = props

  const numPlanes = planesConfig.filter(({ type }) => type !== PlaneType.NONE)
    .length

  const trigger = (
    <span>
      <Icon name="plane" /> <strong>Planes:</strong> {numPlanes}
    </span>
  )

  return (
    <Dropdown trigger={trigger} item>
      <Dropdown.Menu>
        {planesConfig.map(planeConfig => (
          <PlaneMenu
            key={planeConfig.position}
            planeConfig={planeConfig}
            setters={setters}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = (state: AppState) => ({
  planesConfig: state.planesConfig
})

const mapDispatchToProps = (dispatch: Dispatch<PlanesConfigActionTypes>) => ({
  setters: {
    onPlaneTypeSet: (plane: PlanePosition, type: PlaneType) =>
      dispatch(setPlaneType(plane, type)),
    onPlaneSlotsSet: (plane: PlanePosition, slots: number) =>
      dispatch(setPlaneSlots(plane, slots)),
    onPlaneSlottingSet: (plane: PlanePosition, slotting: Slotting) =>
      dispatch(setPlaneSlotting(plane, slotting))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Planes)
