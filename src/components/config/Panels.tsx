import React from "react"
import PanelContext from "./PanelContext"
import Slots from "./Slots"
import Planes from "./Planes"
import View from "./View"

export default function Panels() {
  const [expanded, setExpanded] = React.useState<string>("")

  return (
    <PanelContext.Provider value={{ expanded, setExpanded }}>
      <div style={{ width: "100%" }}>
        <Slots />
        <Planes />
        <View />
      </div>
    </PanelContext.Provider>
  )
}
