
export default new class {

  getStatus() {
    return Promise.resolve();
  };

  getLatestBlock = jest.fn().mockReturnValue(Promise.resolve({
    Update: []
  }));

}