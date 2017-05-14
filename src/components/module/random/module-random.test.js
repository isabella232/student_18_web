jest.mock('../../../services/websocket');

import React from 'react'
import {mount} from 'enzyme'

import ModuleRandom from './module-random'

describe('components:module:random:module-random', () => {

  it('should render without crashing', () => {
    const wrapper = mount(<ModuleRandom/>);

    expect(wrapper.hasClass('module-random')).toBeTruthy();
  });

  it('should manage the counter', () => {
    const wrapper = mount(<ModuleRandom/>);
    wrapper.instance()._timestamp = Date.now();

    wrapper.instance()._checkCountDown();
    expect(wrapper.state('counter')).toBeLessThan(1);

    wrapper.instance()._timestamp = 0;
    wrapper.instance()._triggerRandomUpdate = jest.fn();
    wrapper.instance()._checkCountDown();
    expect(wrapper.instance()._triggerRandomUpdate).toHaveBeenCalledTimes(1);
  });

});