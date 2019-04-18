import React, { Component } from 'react';

import { Container, Sidebar } from 'semantic-ui-react'
import Menu from './Menu';
import ConfigSidebarContainer from './ConfigSidebarContainer';
import FormationContainer from './FormationContainer';
import ConfigMenu from './ConfigMenu';

class App extends Component {
  constructor(props) {
    super(props)

    // this.onUpdateUser = this.onUpdateUser.bind(this)
    this.state = {
      visible: false
    };
    this.handleSidebarHide = this.handleSidebarHide.bind(this)
    this.handleShowClick = this.handleShowClick.bind(this)
  }

  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })



  render() {
    const {visible} = this.state
    return (
      <div>
        <Sidebar.Pushable style={{height: '100vh'}}>
        <ConfigSidebarContainer visible={visible} onSidebarHide = {this.handleSidebarHide}/>
        <Sidebar.Pusher>
        <Container style={{marginTop: '10px', height: '100vh'}}>
            <ConfigMenu/>
            <Menu showSidebar={this.handleShowClick}/>
            <FormationContainer/>
            </Container> 
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      </div>
    );
  }
}

export default App
