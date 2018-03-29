import React, { Component } from 'react';
import { DrawView } from 'react-native-colview';
import PropTypes from 'prop-types';

export default class ScreenShot extends Component {

  componentWillReceiveProps(nextProps) {
    const { lecture, screen, playerActions, onlineScreenActions } = this.props;

    if (nextProps.lecture.initialized === true &&
      nextProps.lecture.initialized !== lecture.initialized) {
      onlineScreenActions.screenTimeUpdate(0);
    }

    // 如果正在下载屏幕数据，暂停播放
    if (nextProps.screen.downloading !== screen.downloading) {
      // 如果开始下载屏幕数据，暂停播放
      if (nextProps.screen.downloading) {
        playerActions.autoPause();
      } else { // 如果下载完成，继续播放
        playerActions.play();
      }
    }

    // 播放到新的一帧画面
    if ((nextProps.screen.index !== screen.index) && !lecture.local) {
      onlineScreenActions.downloadBlock(nextProps.screen.index); // 检查和下载当前屏幕数据
    }
  }

  shouldComponentUpdate(nextProps) {
    const { screen } = nextProps;
    const dirtyFrame = screen.dirtyFrame;
    
    const canUpdate = dirtyFrame !== null && (screen.cachedImages[dirtyFrame.blockIndex] !== undefined);
    return canUpdate && !nextProps.player.seeking;
  }

  render() {
    const { screen, style } = this.props;
    const dirtyFrame = screen.dirtyFrame;
    const blobData = (dirtyFrame !== null ? screen.cachedImages[dirtyFrame.blockIndex] : null);
    const tileWidth = (dirtyFrame !== null ? dirtyFrame.tileWidth : 0);
    const tileHeight = (dirtyFrame !== null ? dirtyFrame.tileHeight : 0);
    const tiles = (dirtyFrame !== null ? dirtyFrame.tiles : {});

    return (
        <DrawView
          ref = "player"
          style = { style }
          local = { false }
          tileWidth = { tileWidth }
          tileHeight = { tileHeight }
          blobData = { blobData }
          tiles = { tiles }
        />
    );
  }
}

ScreenShot.propTypes = {
  style: PropTypes.object.isRequired,
  screen: PropTypes.object.isRequired,
  lecture: PropTypes.object.isRequired,
  onlineScreenActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
};


