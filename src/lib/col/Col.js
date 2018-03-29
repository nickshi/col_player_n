import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob-col';
import ScreenFrame from './ScreenFrame';
import ScreenTile from './ScreenTile';
import WhiteboardBlock from './WhiteboardBlock';
import WhiteboardPoint from './WhiteboardPoint';

const pako = require('pako');
var Buffer = require('buffer/').Buffer;
export default {
    // unzip the file first
  decompress: function (filepath, callback) {
    RNFetchBlob.fs.readFile(filepath, 'base64')
    .then((data) => {
      var baseBuf = new Buffer(data, 'base64');
      var compressed = new Uint8Array(baseBuf.buffer);

      try {
        const result = pako.inflate(compressed);
        //console.log('decompressed '+ filepath, result);
        const buf = new Buffer(result.buffer);
        callback(null, buf);
      } catch (err) {
        console.log(`decompress(${filepath}) error: ${err}`);
        callback(err, null);
      }
    }).catch((error) => {
      console.log(error);
    });
  },

  parseWhiteboardIndex: function (filepath) {
    return new Promise((resolve, reject) => {
      let blocks = [];
      let offset = 0;
      let lastBlock = null;
      this.decompress(filepath, (err, buffer) => {
        if (err) {
          console.log(err.stack);
          return reject(err);
        }
        while (offset < buffer.length) {

          const block = new WhiteboardBlock(buffer, offset);
          if (block.offset === -1 && lastBlock !== null) {
            block.cloneRange(lastBlock);
          }
          blocks.push(block);
          lastBlock = block;
          offset += 11;
        }
        resolve(blocks);
      });
    });
  },

  parseWhiteboardData: function (filepath, blocks) {
    return RNFetchBlob.fs.readFile(filepath, 'base64')
    .then((data) => {
      var baseBuf = new Buffer(data, 'base64');
      let allPoints = [];
      let offset = 0;
      while (offset < baseBuf.length) {
        if (offset + 8 <= baseBuf.length) {
          const point = new WhiteboardPoint(baseBuf, offset);
          allPoints.push(point);
        }
        offset += 8;
      }

      let milliseconds = [];


      blocks.forEach(block => {
        let points = [];
        const os = block.offset / 8;
        const length = block.length / 8;
        if (offset !== -1) {
          for (let idx = os; idx < os + length; idx++) {
            let p = allPoints[idx];
            p.millisecond += block.minute * 60 * 1000;
            points.push({
              millisecond: p.millisecond,
              x: p.x,
              y: p.y,
            });
          }
        }
      });

      let blockList = [];
      let block = null;
      allPoints.forEach(point => {
        //clear
        if (point.x === -200) {
          if (block !== null) {
            block.points.push(point);
          }
          block = null;
          return;
        }
        if (block === null) {
          block = {
            points: [],
          };
          blockList.push(block);
        }
        block.points.push(point);
      });
      let blockIndex = 0;
      blockList = blockList.map(block => {
        let seconds = [];
        let frameDic = {};
        let frames = [];
        let start = 0;
        let end = 0;

        let pointIndex = 0;
        block.points.forEach(point => {
          const mil = point.millisecond;
          let frame;
          if (mil in frameDic) {
            frame = frameDic[mil];
          } else {
            milliseconds.push(mil);
            seconds.push(mil);
            frame = {
              millisecond: mil,
              blockIndex,
              start: pointIndex,
              end: pointIndex,
            };
            frameDic[mil] = frame;
          }
          if (frame.end < pointIndex) {
            frame.end = pointIndex;
          }
          if (!start) {
            start = mil;
          }
          if (end < mil) {
            end = mil;
          }
          pointIndex++;
        });
        blockIndex++;

        for (let second of seconds) {
          frames.push(frameDic[second]);
        }
        return {
          start,
          end,
          points: block.points,
          frames,
        };
      });

      if (!milliseconds.length) {
        return null;
      }
      return {
        blockIndex,
        milliseconds,
        blocks: blockList,
      };
    });
  },
  // parse index file to screen frames
  parseScreenIndex: function (filepath) {
    return new Promise((resolve, reject) => {
      var offset = 0, // current offset
        lastTile = null, // last screen tile
        prevFrame = null, // previous frame
        seconds = [], // all seconds
        // the original frames from index file,
        // some frames' tiles data depend on the previous frame
        frames = {},
        fullFrames = []; // every full frame has full tiles

      // decompress the data first
      this.decompress(filepath, function (err, buffer) {
        if (err) {
          return reject(err);
        }

        while (offset < buffer.length) {
          var tile = new ScreenTile(buffer, offset);

          // if offset is -1, copy previous one
          if (tile.offset == -1 && lastTile != null) {
            tile.cloneRange(lastTile)
          }

          var second = tile.timestamp,
              frame = frames[second];

          if (!frame) {
              frame = new ScreenFrame(second)
              frames[second] = frame
              seconds.push(second)
          }

          frame.addTile(tile)
          frames[second] = frame

          lastTile = tile;
          offset += 11;
        }

        // sort seconds by asc
        seconds = seconds.map(function(second) {
                  return parseInt(second);
              }).sort(function(a, b) {
                  return a - b;
              });

        _.forEach(seconds, function(s) {
          var frame = frames[s]
          var fullFrame = new ScreenFrame(s);
          if (!prevFrame) {
              prevFrame = frame
          }
          // 8x8 tiles
          for (var i = 0; i < 64; i++) {
            var tile = frame.tiles[i],
                previousTile = prevFrame.tiles[i];
            if (tile) {
              fullFrame.addTile(tile);
            } else if (previousTile) { // if can't find the tile from current frame
              fullFrame.addTile(previousTile); // use the previous's
            } else { //in case the first frame misses any tile
              fullFrame.addTile({
                  timestamp: s,
                  grid: i,
                  row: i / 8,
                  col: i % 8,
                  offset: 0,
                  length: 0
                });
            }
          }
          fullFrames.push(fullFrame);
          prevFrame = fullFrame;
        });

        resolve({
          seconds,
          frames: fullFrames,
        });
      });
    });
  },

  loadTileData: function (dataFilepath, offset, length) {
    return RNFetchBlob.fs.readFromFile(dataFilepath, 'base64', offset, length);
  },
}