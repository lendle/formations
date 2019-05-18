import React, { Dispatch } from "react"
import { connect } from "react-redux"
import {
  ColorOption,
  NumberOption,
  ShowOption,
  ViewConfigState,
  ViewConfigActionTypes
} from "../../store/types"
import { setColorBy, setNumberBy, setShow } from "../../store/actions"
import { AppState } from "../../store/reducer"
import SettingsPanel from "./SettingsPanel"
import { NumDict } from "../../formation/interfaces"
import Select from "./Select"

type Props = {
  viewConfig: ViewConfigState;
  onSetColorBy: (opt: ColorOption) => void;
  onSetNumberBy: (opt: NumberOption) => void;
  onSetShow: (opt: ShowOption) => void;
}

const colorBys = [
  ColorOption.DEFAULT,
  ColorOption.PLANE,
  ColorOption.BUILD_ORDER,
  ColorOption.RADIAL
]
const colorByDesc: NumDict<string> = {
  [ColorOption.DEFAULT]: "Default",
  [ColorOption.PLANE]: "Plane",
  [ColorOption.BUILD_ORDER]: "Build Order",
  [ColorOption.RADIAL]: "Radial"
}

const numberBys = [
  NumberOption.SLOT_NUM,
  NumberOption.SLOT_NUM_BY_PLANE,
  NumberOption.BUILD_ORDER
]

const numberByDesc: NumDict<string> = {
  [NumberOption.SLOT_NUM]: "Slot Number",
  [NumberOption.SLOT_NUM_BY_PLANE]: "Slot Number by Plane",
  [NumberOption.BUILD_ORDER]: "Build Order"
}

const showOptions = [ShowOption.FORMATION, ShowOption.PLANES, ShowOption.BOTH]

const showOptionDesc: NumDict<string> = {
  [ShowOption.FORMATION]: "Formation",
  [ShowOption.PLANES]: "Planes",
  [ShowOption.BOTH]: "Formation & Planes"
}

const View = (props: Props) => {
  const { viewConfig, onSetColorBy, onSetNumberBy, onSetShow } = props

  return (
    <React.Fragment>
      <SettingsPanel
        name="colorby"
        heading1="Color by"
        heading2={colorByDesc[viewConfig.colorBy]}
      >
        <Select
          label="Color by"
          value={viewConfig.colorBy}
          opts={colorBys}
          desc={colorByDesc}
          onSet={onSetColorBy}
        />
      </SettingsPanel>
      <SettingsPanel
        name="numberby"
        heading1="Number by"
        heading2={numberByDesc[viewConfig.numberBy]}
      >
        <Select
          label="Number by"
          value={viewConfig.numberBy}
          opts={numberBys}
          desc={numberByDesc}
          onSet={onSetNumberBy}
        />
      </SettingsPanel>
      <SettingsPanel
        name="show"
        heading1="Show"
        heading2={showOptionDesc[viewConfig.show]}
      >
        <Select
          label="Show"
          value={viewConfig.show}
          opts={showOptions}
          desc={showOptionDesc}
          onSet={onSetShow}
        />
      </SettingsPanel>
    </React.Fragment>
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
