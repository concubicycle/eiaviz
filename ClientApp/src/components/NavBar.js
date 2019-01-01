import React, { Component } from 'react';
import { NavLink } from "react-router-dom";


import {
    Menu
} from 'semantic-ui-react'


class NavBar extends Component {
    state = {}
    render() {
        return <Menu inverted>
            <Menu.Item as={NavLink} to='/'>Home</Menu.Item>
            <Menu.Item as={NavLink} to='/about'>About</Menu.Item>
        </Menu>

    }
}

export default NavBar;