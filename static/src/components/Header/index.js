import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import DatePicker from 'material-ui/DatePicker';

import * as actionCreators from '../../actions/auth';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectedDate: new Date()
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }

    requestData(date) {
        // fetch('/api/load_data', {
        //     method: 'post',
        //     credentials: 'include',
        //     headers: {
        //         'Accept': 'application/json', // eslint-disable-line quote-props
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ date }),
        // })
        // .then(res => {
        //     if (res.status === 200) {
        //         res.json().then(json => {
        //             // load the data successfully
        //             console.log(json)
        //         });
        //     } else {
        //         console.log(res);
        // }})
        dispatchNewRoute('mail')
    }

    dateToYMD (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    handleClickOutside() {
        this.setState({
            open: false,
        });
    }

    handleDateChange = (event, date) => {
        this.setState({ selectedDate: date })
    }

    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <header>
                <AppBar
                  title="Information Leak Dashboard"
                  iconElementRight={
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <DatePicker id='date-picker' textFieldStyle={{width: 150}} defaultDate={this.state.selectedDate} onChange={this.handleDateChange} autoOk={true} />
                            <FlatButton label="Result" style={{color: 'white'}} onClick={() => this.dispatchNewRoute('mail?date='+this.dateToYMD(this.state.selectedDate))} />
                        </div>
                    }
                />
            </header>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};
