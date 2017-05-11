jest.mock('./genesis');

import {IFrameService} from './iframe'

describe('services:iframe', () => {

  it('should be defined in the window object', () => {
    expect(window.IFrameService).toBeDefined();
  });

  it('should listen for message', () => {
    const service = new IFrameService();
    service.open = jest.fn();

    const event = new CustomEvent('message');
    window.dispatchEvent(event);

    expect(service.open).toHaveBeenCalledTimes(0);

    event.data = 'skipchain://blabla';
    window.dispatchEvent(event);

    expect(service.open).toHaveBeenCalledTimes(1);
  });

  it('should open the page', () => {
    expect.assertions(4);

    const service = new IFrameService();
    service._getRoot = jest.fn();
    const root = {};
    service._getRoot.mockReturnValue(root);

    return service.open('').then(() => {
      expect(root.className).toBe('active');
      expect(root.innerHTML).toBeDefined();

      service.back();

      expect(root.className).toHaveLength(0);
      expect(root.innerHTML).toHaveLength(0);
    });
  });

});