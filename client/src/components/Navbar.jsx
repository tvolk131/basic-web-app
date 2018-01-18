import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openNavbar, closeNavbar, setNavbar } from '../store/modules/global';
import { Drawer, MenuItem, AppBar, FlatButton } from 'material-ui';
import { NavLink } from 'react-router-dom';
import { Home, ExitToApp, ViewList, VideogameAsset, Settings, ViewCarousel } from 'material-ui-icons';
const navItemStyle = {textDecoration: 'none'};
const redirectTo = (url) => {
  window.location.replace(url);
};

const Navbar = (props) => (
  <div>
    <AppBar
      title='Title'
      onLeftIconButtonTouchTap={props.openNavbar}
      iconElementRight={props.currentUser ?
        <FlatButton
          labelStyle={{ fontSize: '21px' }}
          onClick={redirectTo.bind(null, '/game')} 
          label='Game'
        /> : null
      }
    />
    <Drawer docked={false} width={250} open={props.isOpen} onRequestChange={(input) => props.setNavbar(input)}>
      {props.currentUser ?
        <div>
          <NavLink to='/' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<Home/>}>Home</MenuItem>
          </NavLink>
          <NavLink to='/game' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<VideogameAsset/>}>Current Game</MenuItem>
          </NavLink>
          <NavLink to='/gamelist' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<ViewList/>}>Find a Game</MenuItem>
          </NavLink>
          <NavLink to='/cardpacks' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<ViewCarousel/>}>Cardpacks</MenuItem>
          </NavLink>
          <NavLink to='/settings' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<Settings/>}>Settings</MenuItem>
          </NavLink>
          <MenuItem onClick={redirectTo.bind(null, '/logout')} leftIcon={<ExitToApp/>}>Logout</MenuItem>
        </div>
        :
        <div>
          <NavLink to='/login' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<ExitToApp/>}>Login/Signup</MenuItem>
          </NavLink>
        </div>}
    </Drawer>
  </div>
);

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser,
  isOpen: global.navbarOpen
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openNavbar,
  closeNavbar,
  setNavbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);