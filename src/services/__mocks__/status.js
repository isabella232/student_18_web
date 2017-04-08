
export default new class {
  subscribe = jest.fn();
  unsubscribe = jest.fn();

  getAvailableRoster = jest.fn().mockReturnValue([{
    system: {}
  }, {
    system: {}
  }, {
    system: {}
  }]);
}