import React, { Component } from 'react';
import {
  View
}
from 'react-native';
import PropTypes from 'prop-types';
import { WhiteBoardView } from 'react-native-colview';

export default class WhiteBoard extends Component {

  // shouldComponentUpdate(nextProps) {
  //   const { screen } = nextProps;
  //   const dirtyFrame = screen.dirtyFrame;
  //   const canUpdate = dirtyFrame !== null && (screen.cachedImages[dirtyFrame.blockIndex] != null);
  //   return canUpdate && !nextProps.player.seeking;
  // }

  render() {
    const { whiteboard } = this.props;
    //console.log("whiteboard.points", whiteboard.points);
    return (
        <WhiteBoardView
          milsecond = { whiteboard.millisecond }
          points = { whiteboard.points }
          {...this.props}
        />
    );
  }
}

WhiteBoard.propTypes = {
  whiteboard: PropTypes.object.isRequired,
  lecture: PropTypes.object.isRequired,
  boardname: PropTypes.string.isRequired,
};


