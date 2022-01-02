import React from "react"

type PanelContextType = {
  expanded: string;
  setExpanded: (panel: string) => void;
}
export default React.createContext<PanelContextType>({
  expanded: "",
  setExpanded: (_: string) => {
    return
  }
})
