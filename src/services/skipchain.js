import CothorityWS from './websocket'
import {buf2hex} from '../utils/buffer'

export class SkipChainService {

  /**
   * Given a list of servers and a genesis block id, try to get the latest block and return a promise that will resolve
   * with the list of server's addresses (WebSocket address)
   * @param servers
   * @param genesisID
   * @returns {Promise}
   */
  getLatestBlock(servers, genesisID) {
    let index = 0;

    return new Promise((resolve, reject) => {

      const onSuccess = (servers) => {
        resolve(servers);
      };

      const onError = () => {
        // Try the next server
        index++;

        if (index < servers.length) {
          this._getUpdates(servers[index], genesisID).then(onSuccess, onError);
        }
        else {
          reject("No servers available");
        }
      };

      this._getUpdates(servers[index], genesisID).then(onSuccess, onError);
    });
  }

  /**
   * Try to get the update list of skipblocks from an address and a genesis block id
   * Parse the response to resolve the promise with the list of WebSocket addresses of the servers
   * @param address {String} ws address to try
   * @param genesisID {String} Hex representation of the genesis block id
   * @returns {Promise.<Array>|*}
   * @private
   */
  _getUpdates(address, genesisID) {

    return CothorityWS.getLatestBlock(address, genesisID).then(

      (response) => {
        if (!response.Update) {
          throw new Error("Malformed response");
        }

        if (!this._verifyUpdates(response.Update)) {
          throw new Error("Update blocks are corrupted");
        }

        const latest = response.Update[response.Update.length - 1];

        // Use the addresses of the roster to generate the WS addresses
        return latest.Roster.list.map(si => {
          const addr = si.address.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)[0];
          const port = Number(si.address.match(/[0-9]{1,6}$/)[0]);

          return addr.replace("127.0.0.1", "192.33.210.8") + ':' + (port + 1);
        });
      }

    );

  }

  /**
   * Check the sanity of the skip blocks and return false if an error occurred
   * @param blocks
   * @returns {boolean}
   * @private
   */
  _verifyUpdates(blocks) {

    return blocks.every((block, blockIndex) => {

      const hash = cryptoJS.hashSkipBlock( // eslint-disable-line
        [block.Index, block.Height, block.MaximumHeight, block.BaseHeight],
        block.BackLinkIDs,
        block.GenesisID,
        blockIndex === 0 ? [] : block.RespPublic,
        block.Roster.list.map(s => s.public)
      );

      // Check the hash of the block
      if (buf2hex(hash) !== buf2hex(block.Hash)) {
        console.log("Wrong hash for block", blockIndex, block);
        return false;
      }

      // Check the forward links
      const publicKeys = block.Roster.list.map(server => server.public);

      block.ForwardLink.forEach(link => {
        const res = cryptoJS.verifyForwardLink(publicKeys, link.Hash, link.Signature); // eslint-disable-line
        if (!res) {
          console.log("Wrong signature for block", blockIndex, block);
          return false;
        }
      });

      return true;
    });

  }

}

export default new SkipChainService();