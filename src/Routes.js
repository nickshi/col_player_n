import {
  Actions,
  Router,
  Reducer,
  Scene,
  DefaultRenderer
} from 'react-native-router-flux';
import {
  connect
} from 'react-redux';
import LoginScreen from './scenes/Login';
import HomeScreen from './scenes/Home';
import PlayerScreen from './scenes/Player';

import SideMenu from './components/SideMenu';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'react-native-drawer';

class NavigationDrawer extends Component {
    render(){
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref="navigation"
                type="displace"
                onOpen={()=>Actions.refresh({key:state.key, open: true})}
                onClose={()=>Actions.refresh({key:state.key, open: false})}
                content={<SideMenu />}
                tapToClose={true}
                openDrawerOffset={0.8}
                panCloseMask={0.8}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54, 1-ratio) }
            })}>
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="login" component={LoginScreen} title="Login" initial={true}/>
    <Scene key="home" component={HomeScreen} title="Home"/>
    <Scene key="player" component={PlayerScreen} title="Player"/>
  </Scene>
            
);

class Routes extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action)
      return defaultReducer(state, action);
    };
  }

  render () {
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        scenes={scenes} />
    );
  }
}

export default connect()(Routes);