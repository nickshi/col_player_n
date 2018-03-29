import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  ListView,
  ActivityIndicator,
  Text,
  Image,
  TouchableHighlight
} from "react-native";
import { Actions } from "react-native-router-flux";
import LectureCell from "./components/LectureCell";
import Header from "../../components/Header";

import Col from "../../lib/col/Col";

import styles from "./style";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.logout = this.logout.bind(this);
    this.playLecture = this.playLecture.bind(this);
    this.downloadLecture = this.downloadLecture.bind(this);
    this.state = {
      dataSource: ds.cloneWithRowsAndSections({}, [])
    };
  }

  componentDidMount() {
    const { courseInfo, coursesActions } = this.props;
    if (!courseInfo.isInitialized) {
      coursesActions.loadCourses();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lecture } = nextProps;
    if (lecture.initialized) {
      Actions.player();
    }
  }

  lectureLoading() {
    const { lecture } = this.props;
    let loadingScreen = (
      <View style={styles.centering}>
        <ActivityIndicator animating={true} size="large" style="" />
      </View>
    );
    if (lecture.loading) return loadingScreen;
  }

  downloadLecture(lecture) {
    if (lecture.state === "pending") {
      const { coursesActions } = this.props;
      coursesActions.downloadLecture(lecture);
    }
  }

  async playLecture(lecture) {
    const { lectureActions } = this.props;
    lectureActions.loadLecture(lecture);
  }

  async clearLectureData(lecture) {
    const { lectureActions } = this.props;
    lectureActions.clearLecture(lecture.id);
  }

  logout() {
    const { accountActions } = this.props;
    accountActions.logout();
    Actions.pop();
  }

  renderSectionHeader(data, sectionId) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }

  renderRow(rowData) {
    const self = this;
    return (
      <LectureCell
        onSelect={() => self.downloadLecture(rowData)}
        playLecture={() => self.playLecture(rowData)}
        clearLectureData={() => self.clearLectureData(rowData)}
        downloadLecture={() => self.downloadLecture(rowData)}
        lecture={rowData}
      />
    );
  }

  render() {
    var { courseNames, courses, courseInfo } = this.props;
    if (courseNames === null) lectures = [];
    if (courses === null) course = {};
    var content;
    if (courseInfo.loading)
      content = (
        <View style={[styles.centering]}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      );
    else
      content = (
        <ListView
          dataSource={this.state.dataSource.cloneWithRowsAndSections(
            courses,
            courseNames
          )}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
      );
    return (
      <View style={styles.container}>
        <Header isLogged={true} onLogout={this.logout} />
        {content}
        {this.lectureLoading()}
      </View>
    );
  }
}

HomeScreen.propTypes = {
  lectures: PropTypes.object,
  course: PropTypes.object,
  courseInfo: PropTypes.object,
  coursesActions: PropTypes.object,
  lectureActions: PropTypes.object,
  accountActions: PropTypes.object
};

export default HomeScreen;
