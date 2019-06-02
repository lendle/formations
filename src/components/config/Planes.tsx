import * as d3 from "d3"
import React, { Dispatch } from "react"
import { connect } from "react-redux"
import PlanePosition from "../../formation/PlanePosition"
import {
  setPlaneSlots,
  setPlaneSlotting,
  setPlaneType,
  setPlaneVideo
} from "../../store/actions"
import { AppState } from "../../store/reducer"
import {
  PlanesConfigActionTypes,
  PlaneState,
  PlaneType,
  Slotting
} from "../../store/types"
import Select from "./Select"
import SettingsPanel from "./SettingsPanel"
import { FormControlLabel, Switch } from "@material-ui/core"

type Setters = {
  onPlaneTypeSet: (plane: PlanePosition, type: PlaneType) => void;
  onPlaneSlotsSet: (plane: PlanePosition, slots: number) => void;
  onPlaneSlottingSet: (plane: PlanePosition, slotting: Slotting) => void;
  onPlaneVideoSet: (plane: PlanePosition, hasVideo: boolean) => void;
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
  const { position, label, slotting, type, slots, hasVideo } = planeConfig
  const {
    onPlaneSlottingSet,
    onPlaneTypeSet,
    onPlaneSlotsSet,
    onPlaneVideoSet
  } = setters

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
    <SettingsPanel
      name={label}
      heading1={label}
      heading2={typeDescriptions[type]}
    >
      <Select
        label="Type"
        value={type}
        opts={types}
        desc={typeDescriptions}
        onSet={(t: number) => onPlaneTypeSet(position, t)}
      />
      <Select
        label="Slots"
        value={slots}
        opts={d3.range(1, 31)}
        onSet={(s: number) => onPlaneSlotsSet(position, s)}
      />
      <Select
        label="Slotting"
        value={slotting}
        opts={slottings}
        desc={slottingDescriptions}
        onSet={(s: number) => onPlaneSlottingSet(position, s)}
      />
      <FormControlLabel
        control={
          <Switch
            checked={hasVideo}
            onChange={() => onPlaneVideoSet(position, !hasVideo)}
            color="primary"
          />
        }
        label="Video"
      />
    </SettingsPanel>
  )
}

type PlanesProps = {
  planesConfig: PlaneState[];
  setters: Setters;
}
const Planes = (props: PlanesProps) => {
  const { planesConfig, setters } = props

  return (
    <React.Fragment>
      {planesConfig.map(planeConfig => (
        <PlaneMenu
          key={planeConfig.position}
          planeConfig={planeConfig}
          setters={setters}
        />
      ))}
    </React.Fragment>
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
      dispatch(setPlaneSlotting(plane, slotting)),
    onPlaneVideoSet: (plane: PlanePosition, hasVideo: boolean) =>
      dispatch(setPlaneVideo(plane, hasVideo))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Planes)
