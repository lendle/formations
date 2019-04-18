import React from 'react';

import { Container } from 'semantic-ui-react'
import FormationContainer from './FormationContainer';
import ConfigMenu from './ConfigMenu';

export default () =>
  <Container fluid style={{ marginTop: '10px', height: '100vh' }}>
    <ConfigMenu/>
    <FormationContainer />
  </Container>