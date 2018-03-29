import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

const styles = StyleSheet.create({
  rowContainer_unselected: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },

  rowContainer_selected: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'gray',
  },

  thumbImage: {
    height: 80,
    width: 80,
  },

  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  courseName: {
    fontSize: 20,
  },

  courseTime: {
    fontSize: 12,
  },

  separator: {
    height: 1,
    backgroundColor: '#dddddd',
  },

});

export default class CourseCell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var { course, coursesActions, selected } = this.props;
    var rowContainerStyle = selected ? styles.rowContainer_selected :
     styles.rowContainer_unselected;
    return (
      <TouchableHighlight onPress=
      {() => coursesActions.courseSelect(course.name)} underlayColor={'#F5F5F0'}
      >
      <View>
      <View style= { rowContainerStyle }>
        <Image source={require('../images/course-item.png')} style={styles.thumbImage} />
        <View style={styles.textContainer}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseTime}>{course.description}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      </View>
      </TouchableHighlight>
    );
  }
}

CourseCell.propTypes = {
  course: PropTypes.object,
  coursesActions: PropTypes.object,
  selected: PropTypes.bool,
};
