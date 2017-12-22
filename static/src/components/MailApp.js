import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import {blue500, yellow600, red500, cyan200, grey500} from 'material-ui/styles/colors';
import Attachment from 'material-ui/svg-icons/file/Attachment';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


class Confidential  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: null
        };
    }

    render() {
      var bg_color = cyan200;
      if (this.state.flag == 'danger') bg_color = red500;
      if (this.state.flag == 'false') bg_color = grey500;
      return (
        <Card>
          <CardHeader
            title="Matched Confidential Content 1"
            actAsExpander={true}
            showExpandableButton={true}
            style={{backgroundColor: bg_color}}
          />
          <CardActions>
            <FlatButton label="Highlight" onClick={() => this.setState({flag: 'danger'})} />
            <FlatButton label="False Alarm" onClick={() => this.setState({flag: 'false'})} />
          </CardActions>
          <CardText expandable={true} style={{maxHeight: 200, overflow: 'hidden', overflowY: 'scroll'}}>
            {this.props.content}
          </CardText>
        </Card>
      );
    }
}


class Email extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        var confidential = (<div />);
        if (this.props.data['Confidential content']!='Null') {
          confidential = (<Confidential content={this.props.data['Confidential content']}/>)
        }
        return (
          <div style={{marginBottom: 100}}>
            <Card>
              <CardHeader
                title={this.props.data['user Id']}
                subtitle={"to: "+this.props.data['Receiver']}
                style={{backgroundColor: cyan200}}
              />
              <CardTitle title="Email title" subtitle={this.props.data['Date']} />
              <CardText style={{maxHeight: 300, overflow: 'hidden', overflowY: 'scroll'}}>
                {this.props.data['Email']}
              </CardText>
            </Card>
            {confidential}
          </div>
        );
    }
}

class EmailListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
          <ListItem
            onClick={this.props.on_click.bind(null)}
            leftAvatar={<Avatar icon={<FileFolder />} backgroundColor={this.props.data['Leak Detected']=="True"?red500:blue500} />}
            rightIcon={(this.props.data['attachment']?<Attachment />:<div />)}
            primaryText={this.props.data['user Id']}
            secondaryText={this.props.data['Email']}
          />
        );
    }
}

class EmailList extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        var email_list = this.props.emails.map(function(mail) {
          return (
            <EmailListItem key={mail['email Id']}
                           data={mail}
                           on_click={this.props.onSelectEmail.bind(null, mail['email Id'])} />
          );
        }.bind(this));

        return (
          <List>
              {email_list}
          </List>
        );
    }
}

class NoneSelected extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      var style = {
        marginLeft: -15, 
        marginRight:-15, 
        backgroundColor:'rgba(0,0,0,.1)',
        display: 'grid',
        height: '100%',
        alignItems: 'center'
      };
      return (
        <div style={style}>
          <p style={{textAlign: 'center'}}>No {this.props.text} selected.</p>
        </div>
      );
    }
}

class Mailbox extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            email_id: null
        };
    }

    handleSelectEmail(id) {
      this.setState({ email_id: id });
    }

    render() {
      var email_id = this.state.email_id;
      var selected_email;
      if (email_id) {
        var mail = this.props.emails.filter(function(mail) {
          return mail['email Id'] == email_id;
        })[0];
        selected_email = <Email key={mail['email Id']}
                                data={mail} />;
      } else {
        selected_email = <NoneSelected text="email" />;
      }
      var style = {
        height: 768,
        overflow: 'hidden',
        overflowY: 'scroll'
      };
      return (
        <div className="row" style={{display: 'flex'}}>
          <Paper className="col-md-4" style={style} zDepth={1}>
            {this.props.emails?
              <EmailList emails={this.props.emails}onSelectEmail={this.handleSelectEmail.bind(this)} />
              :<NoneSelected text="mailbox" />}
          </Paper>
          <div className="col-md-8" style={style}>
            {selected_email}
          </div>
        </div>
      );
    }
}

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
class MailApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
      super(props);
      this.state = {
          query: null,
          emails: null
      };
  }

  fetchData() {
    if (this.props.location.query.date) {
      fetch('/api/load_data', {
          method: 'post',
          credentials: 'include',
          headers: {
              'Accept': 'application/json', // eslint-disable-line quote-props
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.props.location.query),
      })
      .then(res => {
          if (res.status === 200) {
              res.json().then(json => {
                  // load the data successfully
                  // console.log(json.result);
                  this.setState({emails: json.result});
              });
          } else {
              console.log(res);
      }})
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.state.query != this.props.location.query) {
      this.fetchData();
      this.setState({query: this.props.location.query})
    }
  }

  render() {
    return (
      <Mailbox emails={this.state.emails} />
    );
  }
}

export default MailApp;
