import React, { Component } from 'react';

class SeriesArea extends Component {

    static propTypes = {

    }

    state = {}
    render() {
        if (this.props.series == null) {
            return <div>No series selected.</div>
        }

        return <div> Series </div>
    }
}



export default SeriesArea;