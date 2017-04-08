jest.mock('./skipchain');

fetch = () => {
  return Promise.resolve({
    json() {
      return Promise.resolve({
        Blocks: [{
          GenesisID: 'id',
          Servers: []
        }]
      });
    }
  });
};

import {GenesisService} from './genesis'

describe(GenesisService, () => {

  it('should manage the listeners', () => {
    const service = new GenesisService();
    const listener = {
      onGenesisUpdate: jest.fn(),
      onGenesisError: jest.fn()
    };

    service.subscribe(listener);
    expect(service.listeners.indexOf(listener)).toBe(0);

    service.updateGenesis();
    expect(listener.onGenesisUpdate).toHaveBeenCalledTimes(2);

    service.updateGenesis(new Error());
    expect(listener.onGenesisError).toHaveBeenCalledTimes(1);

    service.unsubscribe(listener);
    expect(service.listeners).toHaveLength(0);

  });

});