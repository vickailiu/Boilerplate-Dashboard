import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';

import NetworkView from './CytoscapeNetwork/NetworkView'

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Analytics extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
      super(props);
      this.state = {
          cxNetwork: null
      };
    }

    render() {
        return (
            <div className="col-md-8">
                <h1>Analytics</h1>
                <hr />
                <NetworkView />
            </div>
        );
    }
}

export default Analytics;
