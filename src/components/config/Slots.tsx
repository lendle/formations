import React, { Dispatch } from "react"
import { connect } from "react-redux"
import { Dropdown, Icon } from "semantic-ui-react"
import { getSlotOptions } from "../../selectors"
import { formationSlots, baseSize } from "../../store/actions"
import { FormationConfigActionTypes } from "../../store/types"
import { AppState } from "../../store/reducer"
import { SlotOptions } from "../../selectors/getSlotOptions"

type Props = {
  slotsOptions: SlotOptions;
  baseSize: number;
  onFormationSlotsSet: (slots: number) => void;
  onBaseSizeSet: (size: number) => void;
}
const Slots = (props: Props) => {
  const {
    slotsOptions: { min, max, slots },
    baseSize,
    onFormationSlotsSet,
    onBaseSizeSet
  } = props

  const trigger = (
    <span>
      <Icon name="users" /> <strong>Slots:</strong> {slots}
    </span>
  )

  return (
    <Dropdown trigger={trigger} pointing className="link item">
      <Dropdown.Menu>
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
        <Dropdown.Item>
          <Dropdown
            trigger={
              <span>
                <strong>Base Size</strong>: {baseSize}
              </span>
            }
          >
            <Dropdown.Menu>
              {[4, 6, 8, 10].map(bs => (
                <Dropdown.Item
                  key={bs}
                  onClick={() => onBaseSizeSet(bs)}
                  active={baseSize === bs}
                >
                  {bs}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = (state: AppState) => ({
  slotsOptions: getSlotOptions(state),
  baseSize: state.formationConfig.baseSize
})

const mapDispatchToProps = (
  dispatch: Dispatch<FormationConfigActionTypes>
) => ({
  onFormationSlotsSet: (slots: number) => dispatch(formationSlots(slots)),
  onBaseSizeSet: (size: number) => dispatch(baseSize(size))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slots)
