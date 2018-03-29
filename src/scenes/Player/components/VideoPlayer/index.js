import _ from 'lodash';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

});

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.loaded = false;
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
    this.onProgress = _.throttle(this.onProgress.bind(this), 1000);
    this.seek = this.seek.bind(this);
    this.seekStart = this.seekStart.bind(this);
    this.seekEnd = this.seekEnd.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this.state = {
      resizeMode: 'contain',
      controls: false,
      skin: 'custom',
    };
  }
  onLoad(data) {
    const { playerActions } = this.props;
    playerActions.durationChange(data.duration);
    console.log('onLoad ', playerActions);
    this.loaded = true;
  }

  onError(error) {

    console.log('Video setup error ', error);

  }

  onProgress(data) {
    const { playerActions, screenActions } = this.props;
    playerActions.timeUpdate(data.currentTime);
    screenActions.screenTimeUpdate(data.currentTime);
  }

  seek(time) {
    try {
      this.refs.player.seek(time);
    } catch (e) {
       console.log(e, 'Video is not ready.');
    }
  }

  play() {
    const { playerActions } = this.props;
    playerActions.play();
  }

  pause() {
    const { playerActions } = this.props;
    playerActions.pause();
  }

  seekStart() {
    const { playerActions } = this.props;
    playerActions.seeking();
  }

  seekEnd() {
    const { playerActions } = this.props;
    playerActions.seeked();
  }

  renderCustomSkin() {
    const { lecture, player, style } = this.props;

    return (
        <Video
        style = { style }
        ref = "player"
        source={{ uri: lecture.videoUrl }}
        onLoad={this.onLoad}
        onError={this.onError}
        onProgress={this.onProgress}
        rate = { player.rate }
        resizeMode="contain"
        paused = { player.paused || player.autoPaused }
        muted = { player.muted }
        { ...this.props }
      />
    );
  }

  render() {
    return this.renderCustomSkin();
  }
}

VideoPlayer.propTypes = {
//   style: PropTypes.object,
  player: PropTypes.object,
  lecture: PropTypes.object,
  playerActions: PropTypes.object.isRequired,
  screenActions: PropTypes.object.isRequired,
};
