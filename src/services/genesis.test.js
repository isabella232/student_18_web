jest.mock('./skipchain');

fetch = (addr) => {
  return Promise.resolve({
    json() {
      if (addr.indexOf('html') === -1) {
        return Promise.resolve({
          Blocks: [{
            GenesisID: '00',
            Servers: []
          },{
            GenesisID: '11',
            Servers: ['127.0.0.1:7000']
          }]
        });
      }
      else {
        return Promise.resolve({
          GenesisID: '00',
          Servers: []
        })
      }
    }
  });
};

import SkipChainService from './skipchain'
import {hex2buf} from '../utils/buffer'
import {GenesisService} from './genesis'

describe('services:genesis', () => {

  beforeEach(() => {
    SkipChainService.getLatestBlock.mockClear();
  });

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

    service.error = new Error();
    service.subscribe(listener);
    expect(listener.onGenesisError).toHaveBeenCalledTimes(2);

  });

  it('should update the genesis id', () => {
    SkipChainService.getLatestBlock.mockReturnValue(Promise.resolve());

    const service = new GenesisService();

    return service._fetch_request.then(() => {
      service.setCurrentGenesisID('11');
    });
  });

  it('should handle the error', () => {
    expect.assertions(1);

    SkipChainService.getLatestBlock.mockReturnValue(Promise.reject(new Error()));

    const service = new GenesisService();

    return new Promise((resolve) => {
      service._fetch_request.then(() => {
        service.setCurrentGenesisID('11');

        service._request.then(() => {
          expect(service.error).toBeDefined();
          resolve();
        });
      });
    });
  });

  it('should handle no block', () => {
    expect.assertions(1);

    const service = new GenesisService();

    return service._fetch_request.then(() => {
      service._fetchStatusForGenesisID('');

      expect(service.error).toBeDefined();
    });
  });

  it('should get the latest block with a genesis id', () => {
    expect.assertions(1);

    SkipChainService.getLatestBlock.mockReturnValue(Promise.resolve([{
      Hash: hex2buf('00')
    }]));

    const service = new GenesisService();

    return service.getLatestFromGenesisID('00', '00').then(block => {
      expect(block).toBeDefined();
    });
  });

});