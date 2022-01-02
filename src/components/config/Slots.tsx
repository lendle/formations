import { FormControl, Typography } from "@material-ui/core"
import Slider from "@material-ui/core/Slider"
import { makeStyles } from "@material-ui/core/styles"
import * as d3 from "d3"
import React, { Dispatch } from "react"
import { isMobile } from "react-device-detect"
import { connect } from "react-redux"
import getSlotOptions, { SlotOptions } from "../../selectors/getSlotOptions"
import {
  baseSize,
  formationSlots,
  setFormationType
} from "../../store/actions"
import { AppState } from "../../store/reducer"
import { FormationConfigActionTypes, FormationType } from "../../store/types"
import Select from "./Select"
import SettingsPanel from "./SettingsPanel"

const useStyles = makeStyles(theme => ({
  slots: {
    display: "flex",
    alignItems: "center"
  },
  slider: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing()
  },
  formControl: {
    margin: theme.spacing(),
    minWidth: 180
  }
}))

const formationTypeDesc = {
  [FormationType.HD]: "Head Down (from below)",
  [FormationType.HD_ABOVE]: "Head Down (from above)",
  [FormationType.HU]: "Head Up (from above)"
}

type Props = {
  slotsOptions: SlotOptions;
  baseSize: number;
  formationType: FormationType;
  onFormationSlotsSet: (slots: number) => void;
  onBaseSizeSet: (size: number) => void;
  onSetFormationType: (formationType: FormationType) => void;
}
const Slots: React.FunctionComponent<Props> = (props: Props) => {
  const {
    slotsOptions: { min, max, slots },
    baseSize,
    formationType,
    onFormationSlotsSet,
    onBaseSizeSet,
    onSetFormationType
  } = props

  const classes = useStyles()

  const baseSizes = [4, 6, 8, 10]
  const slotItems = d3.range(min, max)
  const formationTypes = [
    FormationType.HD,
    FormationType.HD_ABOVE,
    FormationType.HU
  ]

  const slotForm = isMobile ? (
    <Select
      label="Slots"
      value={slots}
      opts={slotItems}
      onSet={onFormationSlotsSet}
    />
  ) : (
      <FormControl className={classes.formControl}>
        <Typography variant="caption" gutterBottom>
          Slots
      </Typography>
        <div className={classes.slots}>
          <Typography>{min}</Typography>
          <Slider
            min={min}
            max={max}
            value={slots}
            step={1}
            className={classes.slider}
            onChange={(_, value) => onFormationSlotsSet(value as number)}
          />
          <Typography>{max}</Typography>
        </div>
      </FormControl>
    )

  return (
    <React.Fragment>
      <SettingsPanel name="slots" heading1="Slots" heading2={slots.toString()}>
        {slotForm}
      </SettingsPanel>
      <SettingsPanel
        name="baseSize"
        heading1="BaseSize"
        heading2={baseSize.toString()}
      >
        <Select
          label="Base Size"
          value={baseSize}
          opts={baseSizes}
          onSet={onBaseSizeSet}
        />
      </SettingsPanel>
      <SettingsPanel
        name="formationType"
        heading1="Formation Type"
        heading2={formationTypeDesc[formationType]}
      >
        <Select
          label="Formation Type"
          value={formationType}
          opts={formationTypes}
          desc={formationTypeDesc}
          onSet={onSetFormationType}
        />
      </SettingsPanel>
    </React.Fragment>
  )
}

const mapStateToProps = (state: AppState) => ({
  slotsOptions: getSlotOptions(state),
  baseSize: state.formationConfig.baseSize,
  formationType: state.formationConfig.type
})

const mapDispatchToProps = (
  dispatch: Dispatch<FormationConfigActionTypes>
) => ({
  onFormationSlotsSet: (slots: number) => dispatch(formationSlots(slots)),
  onBaseSizeSet: (size: number) => dispatch(baseSize(size)),
  onSetFormationType: (type: FormationType) => dispatch(setFormationType(type))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slots)
