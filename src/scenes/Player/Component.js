import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';
import VideoPlayer from './components/VideoPlayer';
import ScreenShot from './components/ScreenShot';
import LocalScreenShot from './components/LocalScreenShot';
import WhiteBoard from './components/WhiteBoard';
import PlayerControl from './components/PlayerControl';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    inner: {
      position: 'absolute',
      top: 0,
      bottom:0, 
      left: 0, 
      right: 0,
    }
  });
const innerObj = StyleSheet.flatten(styles.inner);

export default class PlayerScreen extends Component {
  constructor(props) {
    super(props);

    this.videoClick = this.videoClick.bind(this);
    this.screenClick = this.screenClick.bind(this);
    this.whiteboard1Click = this.whiteboard1Click.bind(this);
    this.whiteboard2Click = this.whiteboard2Click.bind(this);

    this.state = {
      interactionsComplete: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsComplete: true });
    });
  }

  playerClick(name) {
    const { layout, playerActions } = this.props;
    const activeLayout = layout[layout.active];
    const clickLayout = layout[name];
    const layout1 = Object.assign({}, clickLayout);
    const layout2 = Object.assign({}, activeLayout);
    const newLayout = {
      [layout.active]: layout1,
      [name]: layout2,
      active: name,
    };
    playerActions.relayout(newLayout);
  }

  screenClick() {
    this.playerClick('screen');
    console.log('screenClick')
  }

  videoClick() {
    this.playerClick('video');
    console.log('videoClick')
  }

  whiteboard1Click() {
    this.playerClick('whiteboard1');
  }

  whiteboard2Click() {
    this.playerClick('whiteboard2');
  }

  renderControl() {
    const { layout } = this.props;
    return (
      <PlayerControl
        style = { layout.control }
        video = { this.video }
        {...this.props}
      />
    );
  }
  renderVideo() {
    const
      {
        player,
        lecture,
        layout,
        playerActions,
        onlineScreenActions,
        localScreenActions,
      } = this.props;
    
    const sActions = lecture.local ? localScreenActions : onlineScreenActions;
    return (
      <View  key = {1} style = { layout.video }>
        <VideoPlayer
          style = { innerObj }
          ref = {(video) => {this.video = video;}}
          player = { player }
          lecture = { lecture }
          playerActions = { playerActions }
          screenActions = { sActions }
        />
        <TouchableOpacity
          onPress = {this.videoClick}
          style = { innerObj }
        />
      </View>
    );
  }

  renderScreen() {
    const { layout, lecture } = this.props;
    
    let screenView;
    if (lecture.local) {
      screenView = (
          <LocalScreenShot
            { ...this.props }
            style = { innerObj }
          />
          );
    } else {
      screenView = (
          <ScreenShot
            { ...this.props }
            style = { innerObj }
          />
          );
    }

    return (
      <View style = { layout.screen }  key = { 2 }>
          {screenView}
          <TouchableOpacity
            onPress = {this.screenClick}
            style = { innerObj }
          />
      </View>
    );
  }

  renderWhiteboard1() {
    const { layout } = this.props;
    return (
      <View key = { 3 } style = {layout.whiteboard1}>
        <WhiteBoard
          boardname = {'whiteboard1'}
          style = {innerObj}
        />
        <TouchableOpacity
          onPress = {this.whiteboard1Click}
          style = {innerObj}
        />
      </View>
    );
  }

  renderWhiteboard2() {
    const { layout } = this.props;
    return (
      <View key = { 4 }  style = {layout.whiteboard2}>
        <WhiteBoard
          style = {innerObj}
          boardname = {'whiteboard2'}
        />
        <TouchableOpacity
          onPress = {this.whiteboard2Click}
          style = {innerObj}
        />
      </View>
    );
  }

  render() {
    const { lecture, layout } = this.props;
    let smallViews = [];
    const views = ['video','screen'];
    
  
    if (lecture.lectureInfo.wb1datasize !== 0) { views.push('whiteboard1'); }
    if (lecture.lectureInfo.wb2datasize !== 0) { views.push('whiteboard2'); }

    const viewsMap = {
      video: this.renderVideo(),
      screen: this.renderScreen(),
      whiteboard1: this.renderWhiteboard1(),
      whiteboard2: this.renderWhiteboard2(),
    };

    if (this.state.interactionsComplete)
      smallViews = views.map(view => (viewsMap[view]));
    return (
      <View style = { styles.container }>
        {smallViews}
        {this.renderControl()}
      </View>
    );
  }
}

PlayerScreen.propTypes = {
  player: PropTypes.object,
  lecture: PropTypes.object,
  layout: PropTypes.object,
  playerActions: PropTypes.object,
  onlineScreenActions: PropTypes.object,
  localScreenActions: PropTypes.object,
};


