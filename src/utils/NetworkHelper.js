import _ from 'lodash';
import testJsonData from '../data/course-list';
import Util from './Util';
import RNFetchBlob from 'react-native-fetch-blob-col';
var React = require('react-native');
var async = require('async');
var {
  AsyncStorage,
} = React;

class NetworkHelper {

  _buildUrl(url, obj) {
    var qs = "";

    var keys = Object.keys(obj);
    var values = Object.values(obj);

    for (var key in keys) {

      var l = keys[key];
      var r = values[key];
      qs += encodeURIComponent(l) + "=" + encodeURIComponent(r) + "&";
    }
    if (qs.length > 0) {
      qs = qs.substring(0, qs.length - 1); //chop off last "&"
      url = url + "?" + qs;
    }
    return url;
  }

  _checkStatus(response) {
    console.log("responseData ", response);
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }


  signin(username, password, callback) {
    var url = 'https://colflash.cdm.depaul.edu/COLiPadWeb/auth',
      qs = {
        v: '1.01',
        u: username,
        p: password
      };

    var finalUrl = this._buildUrl(url, qs);

    fetch(finalUrl, {
        method: 'GET'
      })
      .then(this._checkStatus)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.key && _.isString(responseData.key) && !_.isEmpty(responseData.key)) {

          AsyncStorage.setItem('auth_username', username, () => {
            console.log('save username', username);
          })

          AsyncStorage.setItem('auth_token', responseData.key, () => {
            console.log('save key', responseData.key);
          })

          return callback(null, {
            username,
            token: responseData.key
          });
        }
        else
        {
          
          callback({
          system: {
            type: 'user',
            stack: ''
          },
          detail: responseData.error,
        });
        }


      })
      .catch(function(err) {
        console.log("signin ", err.stack)
        callback({
          system: {
            type: 'network',
            stack: err
          },
          detail: 'Failed to connect to server.'
        })
      });
  }



  async loadCourses(callback) {

    var username = await AsyncStorage.getItem('auth_username');
    var token = await AsyncStorage.getItem('auth_token');

    if (!token || !username) {
      return callback({
        token: 'Invalid authentication token, please sign in again!'
      });
    }

    var url = 'https://colflash.cdm.depaul.edu/COLiPadWeb/courselist',
      qs = {
        u: username,
        k: token
      };

    var finalUrl = this._buildUrl(url, qs);

    fetch(finalUrl, {
        method: 'GET'
      }, )
      .then((res) => {

        if (res.status == 401 || res.status == 403) {

          var error = new Error(response.statusText);
          error.response = res;
          throw error;
        } else {
          return res;
        }

      })
      .then((response) => response.json())
      .then((lectures) => {
        console.log('lectures ', lectures);
        async.map(lectures,
          async function(lecture, callback) {
            
            const lectureDir = await Util.getLectureDir(lecture.id);
            
            lecture.startTime = new Date(lecture.start).getTime();

            let fullSize = 0;
            let curSize = 0;
      
            async function caculateSize(name, filename, sizeKey) {
              const desFilePath = lectureDir + '/' + filename;

              const tempFilepath = lectureDir + '/' + filename +'.download';
              const isDesExist = await Util.isFileExist(desFilePath);
              const isTempExist = await Util.isFileExist(tempFilepath);

              fullSize += lecture[sizeKey];

              let fdownloadSize = 0
              if (isDesExist) {
                fdownloadSize = lecture[sizeKey];
              } else {
                if (isTempExist) {
                  const stat = await RNFetchBlob.fs.stat(tempFilepath);
                  fdownloadSize = parseInt(stat.size, 10);
                }
              }

              curSize += fdownloadSize;
              lecture[name + 'downloaded'] = fdownloadSize;
              lecture[name + 'filepath'] = desFilePath;
            }

            await caculateSize('wb1index', 'wb1index.pak', 'wb1indexsize');
            await caculateSize('wb1data', 'wb1data.pak', 'wb1datasize');
            await caculateSize('wb2index', 'wb2index.pak', 'wb2indexsize');
            await caculateSize('wb2data', 'wb2data.pak', 'wb2datasize');
            await caculateSize('screenindex', 'screenindex.pak', 'screenindexsize');
            await caculateSize('screendata', 'screendata.pak', 'screendatasize');
            await caculateSize('video', 'video.mp4', 'videosize');

            lecture.curSize = curSize;
            lecture.fullSize = fullSize;
            if (curSize < fullSize)
              lecture.state = 'pending';
            else
              lecture.state = 'downloaded';
            callback(null, lecture);
          },
          function(err, results) {

            lectures = _.keyBy(results, 'id')
            callback(null, lectures);
          }
        );
      })
      .catch((err) => {

        callback({
          system: {
            type: 'network',
            stack: err
          },
          detail: 'Failed to connect to server or server error occued.'
        })
      })
  }

  async downloadLecture(url, filepath, dBytes, progress) {
    
    var username = await AsyncStorage.getItem('auth_username');
    var token = await AsyncStorage.getItem('auth_token');

    if (!token || !username) {
      return Promise.reject({ token: 'Invalid authentication token, please sign in again!'});
    }

    var qs = {
      u: username,
      k: token,
    };

    var finalUrl = this._buildUrl(url, qs);


    var notifyProgress = _.throttle(function(receivedSize, totalSize) {
        //console.log('progress', receivedSize / totalSize)
        progress(receivedSize, totalSize);
        
      }, 1000);

    var begin = (response) => {
      console.log('response ', response);
    }
    var aProgress = (params) => {
      //console.log('params ', params);
      
      notifyProgress(params.bytesWritten, params.contentLength); 
    }
    const downloadPath = filepath + ".download";
    const options = {
      fromUrl: finalUrl,
      toFile: downloadPath,
      begin: begin,
      progress: aProgress,
    };

    return RNFetchBlob
    .config({
      path: downloadPath,
      breakpointDownload: true,
    })
    .fetch('GET', finalUrl, {
        Range:'bytes='+dBytes + '-',
      })
    .progress((received, total) => {
      received = parseInt(received, 10)
      notifyProgress(received + dBytes, total); 
    })
    .then((resp)=> {
      RNFetchBlob.fs.mv(downloadPath, filepath)
      .catch(error=> {
        console.log('moveError ', error);
      });
      return resp;
    })
    ;
  }

}

export default new NetworkHelper();