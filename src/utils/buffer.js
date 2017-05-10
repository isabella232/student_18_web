import ByteBuffer from 'bytebuffer'

/**
 * Given a hexadecimal string it converts it to a Uint8Array buffer
 * @param hex {String}
 * @returns {Uint8Array}
 */
export function hex2buf(hex) {
  return new Uint8Array(ByteBuffer.fromHex(hex).buffer);
}

/**
 * Given a buffer, convert it to an hexadecimal string
 * @param buffer {Uint8Array}
 * @returns {String}
 */
export function buf2hex(buffer) {
  if (!buffer) {
    return '';
  }

  return ByteBuffer.wrap(buffer).toHex();
}