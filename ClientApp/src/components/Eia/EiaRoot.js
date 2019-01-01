import React, { Component } from 'react';

import styled from 'styled-components'

import Categories from './Categories'
import SeriesArea from './SeriesArea'

import { actions } from '../../store/EiaApi';
import { selectors } from '../../store/EiaApi';
import { connect } from 'react-redux';



const RootContainer = styled.div`
    display: flex;
    flex-flow: row;
    height: 100%;
    align-items: stretch;
`;

const Sidebar = styled.div`
    width: 65vw;
    padding: 10px;
    background: #F3EEDD;
    min-width: 450px;    
`;

const Series = styled.div`
    width: 80vw;
    padding: 10px;
`;

class Root extends Component {
    state = {}

    componentDidMount() {
        this.props.getCategory(371, this.props.apiKey)
    }

    render() {
        return <RootContainer>
            <Sidebar>
                <Categories rootCategory={this.props.categoryRoot} />
            </Sidebar>
            <Series>
                <SeriesArea series={null} />
            </Series>
        </RootContainer>

    }
}

export default connect((state) => ({
    categoryRoot: selectors.categoryRoot(state),
    apiKey: selectors.apiKey(state)
}), actions)(Root)

//export default Root;

/**
 *  <Sidebar
                animation='push'
                direction='left'
                icon='labeled'
                vertical
                visible={true}
                width='wide'>

                   <Sidebar
                visible={true}
                direction='left'
                animation='push'>

                <div>
                    <ul>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                        <li>foo</li>
                    </ul>
                </div>
            </Sidebar>
 */