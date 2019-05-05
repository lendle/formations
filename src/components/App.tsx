import React from "react"

import FormationContainer from "./FormationContainer"
import ConfigDrawer from "./config/ConfigDrawer"
import ConfigMenu from "./config/ConfigMenu"

export default () => (
  <ConfigDrawer contents={<ConfigMenu />}>
    <FormationContainer />
  </ConfigDrawer>
)
