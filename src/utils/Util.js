import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob-col';

var Util = {
	getUserDataDir: function() {
		return RNFetchBlob.fs.dirs.DocumentDir;
	},

	getLecturesDir: async function() {
		var userDir = this.getUserDataDir();
		var lecturesDir = userDir + "/letcures";

		var exist = await RNFetchBlob.fs.exists(lecturesDir);

		if (!exist)
			await RNFetchBlob.fs.mkdir(lecturesDir);

		return lecturesDir;
	},

	getLectureDir: async function(lectureID) {
		var dir = await this.getLecturesDir();
		dir = dir + "/" + lectureID;

		var exist = await RNFetchBlob.fs.exists(dir);
		if (!exist) {
			await RNFetchBlob.fs.mkdir(dir);
		}
		return dir;
	},

	isFileExist: async function(filePath) {
		var exist = await RNFetchBlob.fs.exists(filePath);

		return exist;
	},

	getFileStat: async function(filePath) {
		var info = await RNFetchBlob.fs.stat(filePath);

		return info;
	},

	getFileStatAsyc: function(filePath) {
		return RNFetchBlob.fs.stat(filePath);
	},

	getCourseInfo: function(state) {
		const allLectures = state.courses.lectures;
		var courseNames = [];
		var courses = {};

		_.forEach(allLectures, function(lecture) {
				if(courseNames.indexOf(lecture.name) === -1) {
					courseNames.push(lecture.name);
					courses[lecture.name] = [];
				}
				courses[lecture.name].push(lecture);
			});
		return {
			courseNames,
			courses,
		};
	},
	
	clearFolderData: function(folderPath) {
		return new Promise((resolve, rejector) => {
			RNFetchBlob.fs.unlink(folderPath)
		  .then(() => {
		    resolve();
		  })
		  .catch((err) => {
		    rejector(err);
		  });
		});
	}

}

export default Util;