export default class WhiteboardPoint {
  constructor(buffer, offset) {
    this.millisecond = buffer.readInt32LE(offset);
    this.x = buffer.readInt16LE(offset + 4);
    this.y = buffer.readInt16LE(offset + 6);
  }
}