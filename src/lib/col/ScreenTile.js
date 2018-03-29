/**
 * A screen tile
 * @param {[type]} buffer [description]
 * @param {[type]} index  [description]
 */
export default class ScreenTile {
  constructor(buffer, offset) {
    this.timestamp = buffer.readInt16LE(offset); // time second
    var grid = buffer.readInt8(offset + 2); // row and col
    this.row = grid >> 4; // row
    this.col = grid & 0xf; // col
    this.offset = buffer.readInt32LE(offset + 3); // off
    this.length = buffer.readInt32LE(offset + 7);
    this.grid = this.row * 8 + this.col // 8 x 8
    this.data = null;
  }

  /**
   * Clone the data range from another tile
   * @param  {[type]} tile [description]
   * @return {[type]}      [description]
   */
  cloneRange(tile) {
    this.offset = tile.offset;
    this.length = tile.length;
  }
}