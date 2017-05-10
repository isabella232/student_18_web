/**
 * Transform a tcp address to the corresponding WS address because the Cothority uses the port + 1 of the tcp address
 * @param address
 * @returns {string}
 */
export function tcp2ws(address) {
  const addr = address.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)[0];
  const port = Number(address.match(/[0-9]{1,6}$/)[0]);

  return addr + ':' + (port + 1);
}