import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import PlayerBar from '../PlayerBar';
import { Actions } from 'react-native-router-flux';
import styles from './style';


export default class PlayerControl extends Component {
  constructor(props) {
    super(props);
    this.handleExit = this.handleExit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleForward = this.handleForward.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.changeOrientation = this.changeOrientation.bind(this);

    this.state = {
       fadeAnim: new Animated.Value(1), // init opacity 0
     };
    this.hidden = false;
  }

  componentDidMount() {
  }

  changeOrientation() {
    const { playerActions } = this.props;
    playerActions.changeOrientation();
  }

  handleExit() {
    const { playerActions } = this.props;
    playerActions.playerExit();
    Actions.pop();
  }

  handleBack() {
    const { player, video } = this.props;
    const backTime = Math.max(0, player.currentTime - 15);
    video.seek(backTime);
  }

  handleForward() {
    const { player, video } = this.props;
    const forwardTime = Math.min(player.duration, player.currentTime + 15);
    video.seek(forwardTime);
  }

  handlePause() {
    const { playerActions } = this.props;
    playerActions.pause();
  }

  handlePlay() {
    const { playerActions } = this.props;
    playerActions.play();
  }

  renderControl() {
    const { player } = this.props;
    let playStateButton = null;
    if (player.paused) {
      playStateButton = (
        <TouchableOpacity onPress = {this.handlePlay}>
          <Image source={require('../../../../images/play.png')} style = {{ width: 30, height: 30 }} />
        </TouchableOpacity>
        );
    } else {
      playStateButton = (
        <TouchableOpacity onPress = {this.handlePause}>
          <Image source={require('../../../../images/pause.png')} style = {{ width: 30, height: 30 }} />
        </TouchableOpacity>
        );
    }

    return (
      <View style= { styles.flowControl }>
        <TouchableOpacity onPress = {this.handleBack}>
          <Image source={require('../../../../images/back.png')} style = {{ width: 30, height: 30 }} />
        </TouchableOpacity>

        { playStateButton }

        <TouchableOpacity onPress = {this.handleForward}>
          <Image source={require('../../../../images/forward.png')} style = {{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
    );
  }


  render() {
    const { style } = this.props;

    const combineStyle = Object.assign({}, style, {opacity: this.state.fadeAnim});
    return (
      <Animated.View
        
        style = {combineStyle}

        onStartShouldSetResponder={()=> true}
        onResponderGrant = {(evt) => {
          if (this.hidden) {
            this.hidden = false;
            Animated.timing(          // Uses easing functions
             this.state.fadeAnim,    // The value to drive
             {toValue: 1}            // Configuration
            ).start();
          } else {
            this.hidden = true;
            Animated.timing(          // Uses easing functions
             this.state.fadeAnim,    // The value to drive
             {toValue: 0}            // Configuration
            ).start();
          }
        }}
      >
        {this.renderControl()}
        <View
          style = { styles.playerBarStyle }
        >
          <PlayerBar
            {...this.props}
            handleExit = { this.handleExit }
          />
        </View>
      </Animated.View>
    );
  }
}

PlayerControl.propTypes = {
  video: PropTypes.object,
  style: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
};
