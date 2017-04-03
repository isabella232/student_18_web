
export default new class {

  subscribe(listener) {
    const blocks = [{
      Roster: {
        list: [{address: '127.0.0.1:7000'}]
      }
    }];

    listener.onGenesisUpdate(blocks);
  }

  unsubscribe = jest.fn();

  getLatestFromGenesisID = jest.fn().mockReturnValue(Promise.resolve({
    Roster: {
      list: []
    }
  }));

}