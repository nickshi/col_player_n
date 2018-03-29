import React, { Component } from 'react';
import { DrawView } from 'react-native-colview';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
export default class LocalScreenShot extends Component {

  componentWillReceiveProps(nextProps) {
    const { lecture, localScreenActions } = this.props;

    if (nextProps.lecture.initialized === true &&
      nextProps.lecture.initialized !== lecture.initialized) {
      localScreenActions.screenTimeUpdate(0);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { screen } = nextProps;
    const dirtyFrame = screen.dirtyFrame;
    const canUpdate = dirtyFrame !== null;
    return canUpdate && !nextProps.player.seeking;
  }

  render() {
    const { screen, style } = this.props;
    
    const dirtyFrame = screen.dirtyFrame;
    const tiles = (dirtyFrame != null ? dirtyFrame.tiles : {});
    
    return (
        <DrawView
          ref = "player"
          local = { true }
          style = { style }
          tiles = { tiles }
        />
    );
  }
}

LocalScreenShot.propTypes = {
  //style: PropTypes.object.isRequired,
  screen: PropTypes.object.isRequired,
  lecture: PropTypes.object.isRequired,
  localScreenActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
};

