import React, { Dispatch } from "react"
import { connect } from "react-redux"
import { Dropdown, Icon } from "semantic-ui-react"
import { getSlotOptions } from "../../selectors"
import {
  formationSlots,
  baseSize,
  setFormationType
} from "../../store/actions"
import { FormationConfigActionTypes, FormationType } from "../../store/types"
import { AppState } from "../../store/reducer"
import { SlotOptions } from "../../selectors/getSlotOptions"

type Props = {
  slotsOptions: SlotOptions;
  baseSize: number;
  formationType: FormationType;
  onFormationSlotsSet: (slots: number) => void;
  onBaseSizeSet: (size: number) => void;
  onSetFormationType: (formationType: FormationType) => void;
}
const Slots = (props: Props) => {
  const {
    slotsOptions: { min, max, slots },
    baseSize,
    formationType,
    onFormationSlotsSet,
    onBaseSizeSet,
    onSetFormationType
  } = props

  const trigger = (
    <span>
      <Icon name="users" /> <strong>Slots:</strong> {slots}
    </span>
  )

  const formationTypes = [
    { opt: FormationType.HD, desc: "Head Down (from below)" },
    { opt: FormationType.HD_ABOVE, desc: "Head Down (from above)" },
    { opt: FormationType.HU, desc: "Head Up (from above)" }
  ].map(({ opt, desc }) => (
    <Dropdown.Item
      key={opt}
      onClick={() => onSetFormationType(opt)}
      active={formationType === opt}
    >
      {desc}
    </Dropdown.Item>
  ))

  const baseSizes = [4, 6, 8, 10].map(bs => (
    <Dropdown.Item
      key={bs}
      onClick={() => onBaseSizeSet(bs)}
      active={baseSize === bs}
    >
      {bs}
    </Dropdown.Item>
  ))

  return (
    <Dropdown trigger={trigger} pointing className="link item">
      <Dropdown.Menu>
        <Dropdown.Header>Slots</Dropdown.Header>
        <Dropdown.Item>
          <span>{min} </span>
          <input
            type="range"
            value={slots}
            min={min}
            max={max}
            onChange={e => onFormationSlotsSet(parseInt(e.target.value))}
          />
          <span> {max}</span>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Base Size</Dropdown.Header>
        {baseSizes}
        <Dropdown.Divider />
        <Dropdown.Header>Formation Type</Dropdown.Header>
        {formationTypes}
      </Dropdown.Menu>
    </Dropdown>
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
