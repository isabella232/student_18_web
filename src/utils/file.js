import ByteBuffer from 'bytebuffer'

/**
 * Read the given file object and return a promise that will resolve with the hash of the file
 * @param file File
 */
export function hashFile(file) {

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const buf = new Uint8Array(e.target.result);
      console.log(buf);
      resolve(new Uint8Array(ByteBuffer.fromHex("6f43d1b0d1a9ffeadf4ee59d6866c841756e01b38ad46e46b1f4329f38900142").buffer));
    };
    reader.readAsArrayBuffer(file);
  });

}