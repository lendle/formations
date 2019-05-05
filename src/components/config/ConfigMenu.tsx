import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import People from "@material-ui/icons/People"
import CompareArrows from "@material-ui/icons/CompareArrows"
import React, { Dispatch } from "react"
import { connect } from "react-redux"
import Slider from "@material-ui/lab/Slider"
import {
  formationSlots,
  baseSize,
  setFormationType
} from "../../store/actions"
import {
  FormationConfigActionTypes,
  FormationType,
  PlaneType
} from "../../store/types"
import { AppState } from "../../store/reducer"
import getSlotOptions, { SlotOptions } from "../../selectors/getSlotOptions"
import NestedList from "./NestedList"
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { isMobile } from "react-device-detect"
import * as d3 from "d3"
import { NumDict } from "../../formation/interfaces"
import AirplanemodeActive from "@material-ui/icons/AirplanemodeActive"
import StarBorder from "@material-ui/icons/StarBorder"
import PlanePosition from "../../formation/PlanePosition"

const useStyles = makeStyles(theme => ({
  slots: {
    display: "flex",
    alignItems: "center"
  },
  slider: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  form: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 180
  }
}))

function makeOpts(opts: number[], desc?: NumDict<string>) {
  return opts.map(opt =>
    isMobile ? (
      <option key={opt} value={opt}>
        {desc ? desc[opt] : opt}
      </option>
    ) : (
      <MenuItem key={opt} value={opt}>
        {desc ? desc[opt] : opt}
      </MenuItem>
    )
  )
}

function selectMenu(
  label: String,
  opts: JSX.Element[],
  value: number,
  onSet: (value: number) => void,
  formControlClass: string
) {
  return (
    <FormControl className={formControlClass}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={e => onSet(parseInt(e.target.value))}
        native={isMobile}
      >
        {opts}
      </Select>
    </FormControl>
  )
}

const formationTypeDesc = {
  [FormationType.HD]: "Head Down (from below)",
  [FormationType.HD_ABOVE]: "Head Down (from above)",
  [FormationType.HU]: "Head Up (from above)"
}

const planePositionDesc = {
  [PlanePosition.LEAD]: "Lead",
  [PlanePosition.LT]: "Left Trail",
  [PlanePosition.RT]: "Right Trail"
}

const planeTypeDesc = {
  [PlaneType.OTTER]: "Otter",
  [PlaneType.SKYVAN]: "Skyvan",
  [PlaneType.NONE]: "None"
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

  const baseSizes = makeOpts([4, 6, 8, 10])
  const slotItems = makeOpts(d3.range(min, max))
  const formationTypes = makeOpts(
    [FormationType.HD, FormationType.HD_ABOVE, FormationType.HU],
    formationTypeDesc
  )

  const slotForm = isMobile ? (
    selectMenu(
      "Slots",
      slotItems,
      slots,
      onFormationSlotsSet,
      classes.formControl
    )
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
          onChange={(_, value) => onFormationSlotsSet(value)}
        />
        <Typography>{max}</Typography>
      </div>
    </FormControl>
  )

  const baseForm = selectMenu(
    "Base Size",
    baseSizes,
    baseSize,
    onBaseSizeSet,
    classes.formControl
  )

  const planeMenus = [
    PlanePosition.LEAD,
    PlanePosition.LT,
    PlanePosition.RT
  ].map(p => {})

  return (
    <React.Fragment>
      <NestedList
        icon={<People />}
        primary={`Slots: ${slots}, Base: ${baseSize}`}
      >
        <ListItem>
          <ListItemText
            primary={
              <form className={classes.form} autoComplete="off">
                {slotForm}
                {baseForm}
              </form>
            }
          />
        </ListItem>
      </NestedList>
      <Divider />
      <NestedList
        icon={<CompareArrows />} //TODO
        primary={`Formation Type: ${formationTypeDesc[formationType]}`}
      >
        <ListItem>
          <ListItemText
            primary={
              <form className={classes.form} autoComplete="off">
                {selectMenu(
                  "Formation Type",
                  formationTypes,
                  formationType,
                  onSetFormationType,
                  classes.formControl
                )}
              </form>
            }
          />
        </ListItem>
      </NestedList>
      <Divider />

      <NestedList icon={<AirplanemodeActive />} primary="Planes ">
        <ListItem>
          <ListItemText
            primary={
              <form className={classes.form} autoComplete="off">
                {}
              </form>
            }
          />
        </ListItem>
      </NestedList>
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
