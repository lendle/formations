import React, { Dispatch } from "react"
import { connect } from "react-redux"
import { Dropdown, Icon } from "semantic-ui-react"
import {
  ColorOption,
  NumberOption,
  ShowOption,
  ViewConfigState,
  ViewConfigActionTypes
} from "../../store/types"
import { setColorBy, setNumberBy, setShow } from "../../store/actions"
import { AppState } from "../../store/reducer"

type Props = {
  viewConfig: ViewConfigState;
  onSetColorBy: (opt: ColorOption) => void;
  onSetNumberBy: (opt: NumberOption) => void;
  onSetShow: (opt: ShowOption) => void;
}
const View = (props: Props) => {
  const { viewConfig, onSetColorBy, onSetNumberBy, onSetShow } = props

  const trigger = (
    <span>
      <Icon name="eye" /> <strong>View</strong>
    </span>
  )

  const colorBys = [
    { opt: ColorOption.DEFAULT, desc: "Default" },
    { opt: ColorOption.PLANE, desc: "Plane" },
    { opt: ColorOption.BUILD_ORDER, desc: "Build Order" }
  ].map(({ opt, desc }) => (
    <Dropdown.Item
      key={opt}
      onClick={() => onSetColorBy(opt)}
      active={viewConfig.colorBy === opt}
    >
      {desc}
    </Dropdown.Item>
  ))

  const numberBys = [
    { opt: NumberOption.SLOT_NUM, desc: "Slot Number" },
    { opt: NumberOption.BUILD_ORDER, desc: "Build Order" }
  ].map(({ opt, desc }) => (
    <Dropdown.Item
      key={opt}
      onClick={() => onSetNumberBy(opt)}
      active={viewConfig.numberBy === opt}
    >
      {desc}
    </Dropdown.Item>
  ))

  const show = [
    { opt: ShowOption.FORMATION, desc: "Formation" },
    { opt: ShowOption.PLANES, desc: "Planes" },
    { opt: ShowOption.BOTH, desc: "Formation & Planes" }
  ].map(({ opt, desc }) => (
    <Dropdown.Item
      key={opt}
      onClick={() => onSetShow(opt)}
      active={viewConfig.show === opt}
    >
      {desc}
    </Dropdown.Item>
  ))

  return (
    <Dropdown trigger={trigger} item>
      <Dropdown.Menu>
        <Dropdown.Header>Color by</Dropdown.Header>
        {colorBys}
        <Dropdown.Divider />
        <Dropdown.Header>Number by</Dropdown.Header>
        {numberBys}
        <Dropdown.Divider />
        <Dropdown.Header>Show</Dropdown.Header>
        {show}
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = (state: AppState) => ({
  viewConfig: state.viewConfig
})

const mapDispatchToProps = (dispatch: Dispatch<ViewConfigActionTypes>) => ({
  onSetColorBy: (colorBy: ColorOption) => dispatch(setColorBy(colorBy)),
  onSetNumberBy: (numberBy: NumberOption) => dispatch(setNumberBy(numberBy)),
  onSetShow: (show: ShowOption) => dispatch(setShow(show))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
