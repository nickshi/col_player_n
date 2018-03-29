/**
 * A screenshot at specific second
 */
export default class ScreenFrame {

  constructor(second) {
    this.second = second; // Time second
    this.tiles = {}; // all 8x8 tiles in frame
  }

  /**
   * Add tile to this frame
   * @param {[type]} tile [description]
   */
  addTile(tile) {
    this.tiles[tile.grid] = tile;
  }

}