import React, { Component } from 'react'

import { List, ListItem } from 'semantic-ui-react'

import styled from 'styled-components'

import { actions, selectors } from '../../store/EiaApi';
import { connect } from 'react-redux';

const ListCont = styled.div`
    overflow-y: scroll;
    overflow-x: scroll;
    height: 100%;
`;


class Categories extends Component {
    state = {}

    loadCat = (id) => () => {
        this.props.getCategory(id, this.props.apiKey)
        this.props.expand(id)
    }

    getSubCatList = (cat) => {
        if (!cat.expanded) {
            return <List.Item key={cat.category_id} >
                <List.Icon name='folder' />
                <List.Content >
                    <List.Header key={cat.name} onClick={this.loadCat(cat.category_id)} >
                        {cat.name}
                    </List.Header >
                </List.Content>
            </List.Item>
        }

        let series = [];
        let cats = [];

        if (cat.childseries != null && cat.childseries.length > 0) {
            for (const s of cat.childseries) {
                series.push(<List.Item key={s.name}>
                    <List.Icon name='chart line' />
                    <List.Content>
                        <List.Header key={s.name}>{s.name}</List.Header>
                    </List.Content>
                </List.Item>)
            }
        }

        if (cat.childcategories != null && cat.childcategories.length > 0) {
            cats = cat.childcategories.map(cc => this.getSubCatList(cc))
        }

        const catList = cats.length > 0
            ? <List.List>{cats}</List.List>
            : null;

        const seriesList = series.length > 0
            ? <List.List>{series}</List.List>
            : null;

        return <List.Item key={cat.category_id} >
            <List.Icon name='folder' />
            <List.Content >
                <List.Header key={cat.name} onClick={this.loadCat(cat.category_id)} >
                    {cat.name}
                </List.Header >
                {seriesList}
                {catList}
            </List.Content>
        </List.Item>
    }

    render() {
        const list = this.getSubCatList(this.props.rootCategory);

        return <ListCont>
            <List>
                {list}
            </List>
        </ListCont>
    }
}

export default connect(state => ({
    apiKey: selectors.apiKey(state)
}), actions)(Categories)

