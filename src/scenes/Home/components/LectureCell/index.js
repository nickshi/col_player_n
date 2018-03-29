import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './style';

export default class LectureCell extends Component {

  formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 Byte';
    const k = 1000; // or 1024 for binary
    const dm = decimals + 1 || 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  render() {
    const { downloadLecture, lecture, playLecture, clearLectureData } = this.props;
    const
    {
      state,
      screendatadownloaded,
      screenindexdownloaded,
      wb1indexdownloaded,
      wb1datadownloaded,
      wb2indexdownloaded,
      wb2datadownloaded,
      videodownloaded,
    } = lecture;
    const downloadedSize = screendatadownloaded
    + screenindexdownloaded
    + wb1indexdownloaded
    + wb1datadownloaded
    + wb2indexdownloaded
    + wb2datadownloaded
    + videodownloaded;
    const downloadedBytes = this.formatBytes(downloadedSize, 1);
    const totalBytes = this.formatBytes(lecture.fullSize, 1);
    let result = null;
    let actionButton;
    if (state === 'downloaded') {
      result = (<Text style={styles.detail} numberOfLines={1}>Local</Text>);
      actionButton = (
        <View style={styles.rightDownloadedContainer}>
          <TouchableOpacity onPress={() => Alert.alert(
              'Message',
              'Do you want to delete the lecture?',
              [
                {text: 'NO', onPress: () => console.log('Cancel Pressed!') },
                {text: 'YES', onPress: clearLectureData },
              ]
            )}>
            <Image
              style={styles.rightButton}
              source={require('../../../../images/delete.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress= { playLecture }>
                  <Image
                    style={styles.rightButton}
                    source={require('../../../../images/play.png')}
                  />
          </TouchableOpacity>
        </View>
      );
    } else if (state === 'pending') {
      result = (<Text style={styles.detail} numberOfLines={1}>{downloadedBytes}/{totalBytes}</Text>);  
      actionButton = (
                  <TouchableOpacity onPress= { downloadLecture }>
                    <Image
                      style={styles.rightButton}
                      source={require('../../../../images/download.png')}
                    />
                  </TouchableOpacity>
      );
    } else {
      result = (<Text style={styles.detail} numberOfLines={1}>{downloadedBytes}/{totalBytes}</Text>);  
    }
    return (
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={require('../../../../images/course-item.png')} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{ lecture.id }</Text>
              <Text style={styles.detail} numberOfLines={1}>{lecture.start}</Text>
              {result}
            </View>
            {actionButton}
     
          </View>
          <View style={styles.separator} />
        </View>
    );
  }
}

LectureCell.propTypes = {
  lecture: PropTypes.object,
  playLecture: PropTypes.func,
  downloadLecture: PropTypes.func,
};
