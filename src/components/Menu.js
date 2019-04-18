import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Menus extends Component {
  state = { activeItem: 'formation' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu pointing secondary>
        <Menu.Item name='settings' onClick={this.props.showSidebar} />
        <Menu.Item
          name='formation'
          active={activeItem === 'formation'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='planes'
          active={activeItem === 'planes'}
          onClick={this.handleItemClick}
        />
      </Menu>
    )
  }
}
