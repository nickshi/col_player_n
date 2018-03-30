import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Util from "../../utils/Util";
import CoursesActionCreators from "../../actions/courses";
import LectureActionCreators from "../../actions/lecture";
import AccountActionCreators from "../../actions/account";
import HomeScreen from "./Component";

function mapDispatchToProps(dispatch) {
  return {
    coursesActions: bindActionCreators(CoursesActionCreators, dispatch),
    lectureActions: bindActionCreators(LectureActionCreators, dispatch),
    accountActions: bindActionCreators(AccountActionCreators, dispatch)
  };
}

function mapStateToProps(state) {
  var courseInfo = Util.getCourseInfo(state);
  return {
    courses: courseInfo.courses,
    lecture: state.lecture,
    loading: state.courses.loading,
    isInitialized: state.courses.isInitialized,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
