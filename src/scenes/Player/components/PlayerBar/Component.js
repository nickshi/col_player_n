import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Slider,
} from 'react-native';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(210, 206, 202, 0.5)',
  },
  currentTime: {
    flex: 2,
    color: 'black',
    backgroundColor: 'transparent',
  },
  durationTime: {
    flex: 3,
    color: 'black',
    backgroundColor: 'transparent',
  },
  progressView: {
    flex: 6,
  },
});

export default class PlayerBar extends Component {
  getProgress() {
    const { player } = this.props;
    const progress = parseFloat(player.currentTime) / parseFloat(player.duration);
    return progress;
  }

  formatSeconds(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (hr < 10) { hr = '0' + hr; }
    if (min < 10) { min = '0' + min; }
    if (sec < 10) { sec = '0' + sec; }
    if (!hr) { hr = '00'; }
    return hr + ':' + min + ':' + sec;
  }

  render() {
    const { player, video, handleExit } = this.props;
    const progress = this.getProgress();
    const strCurrent = this.formatSeconds(player.currentTime);
    const strDuration = this.formatSeconds(player.duration);

    return (
        <View
          style = { styles.container }
        >
          <Text style = { styles.currentTime }>{strCurrent}</Text>
          <Slider
            progress = { progress }
            style = { styles.progressView }
            onValueChange={(value) => {
              const currentTime = Math.floor(value * player.duration);
              //video.seek(currentTime);
              //console.log('currentTime ', currentTime);
            }}
            onSlidingComplete = {(value) => {
              const currentTime = Math.floor(value * player.duration);
              video.seek(currentTime);
            }}
          />
          <Text style = { styles.durationTime }>{strDuration}</Text>
          <TouchableOpacity onPress = {() => {
            handleExit();
          }}
          >
            <Image source={require('../../../../images/Player-Min.png')} style = { { width: 30, height: 30 } } />
          </TouchableOpacity>
        </View>
      );
  }
}

PlayerBar.propTypes = {
  player: PropTypes.object,
  video: PropTypes.object,
};

