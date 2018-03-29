export default class WhiteboardBlock {
  constructor(buffer, offset) {
    this.minute = buffer.readInt16LE(offset);
    this.offset = buffer.readInt32LE(offset + 3);
    this.length = buffer.readInt32LE(offset + 7);
  }

  cloneRange(block) {
    this.offset = block.offset;
    this.length = block.length;
  }
}