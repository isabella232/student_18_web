jest.mock('../../../services/status', () => class {
  getAvailableRoster = jest.fn()
});

jest.mock('../../../services/websocket', () => new class {
  getSignature = jest.fn()
});

import React from 'react'
import {mount} from 'enzyme'
import {Button} from 'reactstrap'

import SignArea from './sign-area'
import CothorityWebsocket from '../../../services/websocket'

global.FileReader = class {
  readAsArrayBuffer() {
    this.onload({target: {result: new Uint8Array([])}});
  }
};
global.cryptoJS = {
  sha256: () => 'super-hash',
  aggregateKeys: () => 'super-key'
};

global.saveAs = jest.fn();

describe(SignArea, () => {
  
  const MOCK_FILE = new File([], '');
  
  it('should render without crashing', () => {
    const wrapper = mount(<SignArea file={MOCK_FILE}/>);
    
    expect(wrapper.hasClass("sign-area")).toBeTruthy();
  });
  
  it('should trigger back event', () => {
    const onBack = jest.fn();
    const wrapper = mount(<SignArea file={MOCK_FILE} onBack={onBack}/>);
    
    wrapper.find(Button).at(0).simulate('click');
    
    expect(onBack).toHaveBeenCalledTimes(1);
  });
  
  it('should sign the file', () => {
    expect.assertions(1);
    
    CothorityWebsocket.getSignature.mockReturnValue(Promise.resolve({signature: 'super-signature'}));
    const wrapper = mount(<SignArea file={MOCK_FILE}/>);
    const roster = [{
      address: 'address',
      server: {
        public: new Uint8Array([])
      }
    }];
    wrapper.instance().service.getAvailableRoster.mockReturnValue(roster);
    
    wrapper.find(Button).at(1).simulate('click');
    
    return wrapper.instance()._signPromise.then(() => {
      expect(saveAs).toHaveBeenCalledTimes(1);
    });
  });
  
  it('should display an error because of ws', () => {
    expect.assertions(1);
    
    CothorityWebsocket.getSignature.mockReturnValue(Promise.reject());
    const wrapper = mount(<SignArea file={MOCK_FILE}/>);
    wrapper.instance().service.getAvailableRoster.mockReturnValue([{address: 'address'}]);
    
    wrapper.find(Button).at(1).simulate('click');
    
    return wrapper.instance()._signPromise.catch(() => {
      expect(wrapper.text()).toContain('Oops');
    });
  });
  
  it('should display an error because of empty roster', () => {
    expect.assertions(1);
    
    const wrapper = mount(<SignArea file={MOCK_FILE}/>);
    wrapper.instance().service.getAvailableRoster.mockReturnValue([]);
  
    wrapper.find(Button).at(1).simulate('click');
  
    return wrapper.instance()._signPromise.catch(() => {
      expect(wrapper.text()).toContain('No node available');
    });
  })
  
});