import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  Text,
  Image,
  TouchableHighlight
} from "react-native";
import { Actions } from "react-native-router-flux";
import LectureCell from "./components/LectureCell";
import Header from "../../components/Header";
import LoadingView from '../../components/LoadingView';
import Col from "../../lib/col/Col";

import styles from "./style";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.playLecture = this.playLecture.bind(this);
    this.downloadLecture = this.downloadLecture.bind(this);

    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
  }

  componentDidMount() {
    const { isInitialized, coursesActions } = this.props;
    if (!isInitialized) {
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

  renderSectionHeader(data) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{data.section.title}</Text>
      </View>
    );
  }

  renderRow(rowData) {
    const { item } = rowData;
    return (
      <LectureCell
        onSelect={() => this.downloadLecture(item)}
        playLecture={() => this.playLecture(item)}
        clearLectureData={() => this.clearLectureData(item)}
        downloadLecture={() => this.downloadLecture(item)}
        lecture={item}
      />
    );
  }

  render() {
    let { courses, loading, lecture } = this.props;

    let sections = Object.keys(courses).map(key => {
      return {
        title: key,
        data: courses[key]
      }
    })

    return (
      <View style={styles.container}>
        <Header isLogged={true} onLogout={this.logout} />
        { (loading || lecture.loading) && <LoadingView/> }
        {
          !loading && (
            <SectionList
              sections={sections}
              renderItem={this.renderRow}
              renderSectionHeader={this.renderSectionHeader}
              keyExtractor={(item, index) => index}
            />
          )
        }
      </View>
    );
  }
}

HomeScreen.propTypes = {
  courses: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  coursesActions: PropTypes.object,
  lectureActions: PropTypes.object,
  accountActions: PropTypes.object
};

export default HomeScreen;
