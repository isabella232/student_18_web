import splitHost from 'split-host'

/**
 * Transform a tcp address to the corresponding WS address because the Cothority uses the port + 1 of the tcp address
 *
 * @param {String} address - TCP with port address format
 * @returns {String} The same address with the port value +1
 */
export function tcp2ws(address) {
    var hp = splitHost(address)
    return hp.host + ':' + (hp.port + 1);
}
