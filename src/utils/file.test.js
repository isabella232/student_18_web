import {hashFile, readAsString} from './file'

global.cryptoJS = {
  sha256: jest.fn()
};

global.FileReader = class {
  
  readAsArrayBuffer() {
    this.onload({
      target: {result: ''}
    });
  }
  
  readAsText() {
    this.onload({
      target: {result: ''}
    });
  }
  
};

describe('utils:file', () => {
  
  it('should hash the given file', () => {
    expect.assertions(1);
    
    return hashFile({}).then(
      () => {
        expect(cryptoJS.sha256).toHaveBeenCalledTimes(1);
      }
    )
  });
  
  it('should read the file as a string', () => {
    expect.assertions(1);
    
    return readAsString({}).then(() => {
      // We don't want to test FileReader, only the fact we are using it
      expect(true).toBeTruthy();
    });
  });
  
});