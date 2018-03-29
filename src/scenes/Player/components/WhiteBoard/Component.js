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
    const { whiteboard, style } = this.props;
    //console.log("whiteboard.points ", whiteboard);
    return (
        <WhiteBoardView
          style = { style }
          milsecond = { whiteboard.millisecond }
          points = { whiteboard.points }
        />
    );
  }
}

WhiteBoard.propTypes = {
  //lecture: PropTypes.object.isRequired,
  boardname: PropTypes.string.isRequired,
};


