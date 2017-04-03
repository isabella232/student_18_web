import ByteBuffer from 'bytebuffer'

export function hex2buf(hex) {
  return new Uint8Array(ByteBuffer.fromHex(hex).buffer);
}

export function buf2hex(buffer) {
  if (!buffer) {
    return '';
  }

  return ByteBuffer.wrap(buffer).toHex();
}