
export default new class {

  subscribe(listener) {
    const blocks = [{
      Roster: {
        list: [{
          address: '127.0.0.1:7000'
        },{
          address: '127.0.0.1:7002'
        },{
          address: '127.0.0.1:7004'
        }]
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