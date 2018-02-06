import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FlatButton, Subheader, Divider } from 'material-ui';
import { List, ListItem } from 'material-ui/List';

const Navbar = (props) => (
  <List>
    <Subheader>Friends</Subheader>
    {props.friends.map((friend, index) => (
      <ListItem
        primaryText={friend.name}
        onClick={console.log}
      />
    ))}

    <Divider/>
    <Subheader>Requests Sent</Subheader>
    {props.requestsSent.map((friend, index) => (
      <ListItem
        primaryText={friend.name}
        onClick={console.log}
      />
    ))}

    <Divider/>
    <Subheader>Requests Received</Subheader>
    {props.requestsReceived.map((friend, index) => (
      <ListItem
        primaryText={friend.name}
        onClick={console.log}
      />
    ))}
  </List>
);

const mapStateToProps = ({friend: {friends, requestsSent, requestsReceived}}) => ({
  friends,
  requestsSent,
  requestsReceived
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);