/**
 * Read the given file object and return a promise that will resolve with the hash of the file
 * @param file File
 */
export function hashFile(file) {
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const buf = new Uint8Array(e.target.result);
      resolve(cryptoJS.sha256(buf)); // eslint-disable-line
    };
    reader.readAsArrayBuffer(file);
  });
  
}

/**
 * Read a file as a string
 * @param file
 * @returns {Promise}
 */
export function readAsString(file) {
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsText(file);
  });
  
}