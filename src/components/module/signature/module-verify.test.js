jest.mock('../../../services/genesis');

import React from 'react'
import Faker from 'faker'
import {mount} from 'enzyme'

import ModuleVerify from './module-verify'

global.FileReader = class {
  readAsText() {
    this.onload({
      target: {
        result: JSON.stringify({
          signature: '000000',
          hash: '11',
          genesisID: 'aa',
          blockID: 'bb'
        })
      }
    });
  }
  
  readAsArrayBuffer() {
    this.onload({target: {result: new Uint8Array([])}});
  }
};
global.cryptoJS = {
  sha256() {
    return 'super-hash'
  },
  verify() {
    return true
  },
  aggregateKeys() {
    return new Uint8Array([]);
  }
};

describe(ModuleVerify, () => {
  
  const MOCK_FILE = new File([], '');
  
  it('should render without crashing', () => {
    const wrapper = mount(<ModuleVerify/>);
    expect(wrapper.hasClass("module-verify")).toBeTruthy();
  });
  
  it('should handle the dropping', () => {
    const wrapper = mount(<ModuleVerify/>);
    wrapper.instance().handleFileDrop(MOCK_FILE);
    
    expect(wrapper.instance().state.file).toBe(MOCK_FILE);
  });
  
  it('should verify the signature', () => {
    expect.assertions(1);
    
    const wrapper = mount(<ModuleVerify/>);
    wrapper.instance().handleFileDrop(MOCK_FILE);
    wrapper.instance().handleFileDrop(MOCK_FILE);
    
    return wrapper.instance()._verifyPromise.then(() => {
      expect(wrapper.instance().state.isSignatureCorrect).toBeTruthy();
    }, (e) => console.log(e));
  });

  it('should reset the state', () => {
    const wrapper = mount(<ModuleVerify/>);
    wrapper.instance().handleFileDrop(MOCK_FILE);
    expect(wrapper.instance().state.file).toBeDefined();

    wrapper.instance().handleFileReset();
    expect(wrapper.instance().state.file).toBeUndefined();
  });

  it('should display the error', () => {
    const wrapper = mount(<ModuleVerify/>);
    const error = Faker.lorem.sentence();
    wrapper.setState({error: error});

    expect(wrapper.text()).toContain(error);
  });
  
});