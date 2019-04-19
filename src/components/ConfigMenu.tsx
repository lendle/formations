import React from 'react'
import { Menu } from 'semantic-ui-react'
import Slots from './config/Slots';
import Planes from './config/Planes';
import View from './config/View';

export default () =>
  <Menu size={"mini"} secondary>
    <Slots/>
    <Planes/>
    <View/>
  </Menu>

