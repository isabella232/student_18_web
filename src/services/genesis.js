import SkipChainService from './skipchain'
import {hex2buf, buf2hex} from '../utils/buffer'
import {tcp2ws} from '../utils/network'

const GENESIS_BLOCK_SERVER = "http://skipchain.dedis.ch/";

/**
 * This service will contact the DEDIS server in order to get the latest genesis ID available.
 * You can also get the list of servers related to a given genesis ID
 */
export class GenesisService {

  listeners = [];
  genesisList = [];
  curr_genesis = '';
  blocks = [];

  constructor() {
    // Get the servers list and the genesis block id
    this._fetch_request = fetch(GENESIS_BLOCK_SERVER, {headers: {'Content-Type': 'application/json'}})
      .then(
        (response) => response.json().then(data => {
          // We keep the list of available blocks
          this.genesisList = data.Blocks;
          this.curr_genesis = this.genesisList[0].GenesisID;

          this._request = this._fetchStatusForGenesisID(this.curr_genesis);
        })
      )
      .catch(() => {
        this.updateGenesis(new Error("Failed to get the list of Genesis blocks."));
      });
  }

  subscribe(listener) {
    if (this.listeners.indexOf(listener < 0)) {
      this.listeners.push(listener);

      // Trigger an event after the subscription. It can be an error update if one occurred before
      if (this.error) {
        this._triggerError(listener);
      }
      else {
        this._triggerEvent(listener);
      }
    }
  }

  unsubscribe(listener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  updateGenesis(error) {
    if (error) {
      this.error = error;
      this.listeners.forEach(listener => this._triggerError(listener));
    }
    else {
      this.listeners.forEach(listener => this._triggerEvent(listener));
    }
  }

  setCurrentGenesisID(id) {
    const data = this.genesisList.filter(b => b.GenesisID === id).pop();
    if (data) {
      this.curr_genesis = id;
      this._request = this._fetchStatusForGenesisID(id);
    }
  }

  getLatestFromGenesisID(id, blockID) {
    return new Promise((resolve, reject) => {
      fetch(GENESIS_BLOCK_SERVER + id + '.html', {headers: {'Content-Type': 'application/json'}})
        .then(
          (response) => response.json().then(data => {
            SkipChainService.getLatestBlock(data.Servers.map(addr => tcp2ws(addr)), hex2buf(id)).then(data => {
              if (blockID) {
                resolve(data.filter(block => buf2hex(block.Hash) === blockID).pop());
              }
              else {
                resolve(data.pop());
              }
            });
          })
        )
        .catch(e => reject(e));
    });
  }

  _triggerEvent(listener) {
    if (typeof listener.onGenesisUpdate === 'function') {
      listener.onGenesisUpdate(this.blocks, this.genesisList, this.curr_genesis);
    }
  }

  _triggerError(listener) {
    if (typeof listener.onGenesisError === 'function') {
      listener.onGenesisError(this.error);
    }
  }

  _fetchStatusForGenesisID(id) {
    const block = this.genesisList.filter(b => b.GenesisID === id).pop();
    if (!block) {
      return this.updateGenesis(new Error("Cannot find the block associated with the genesis ID"));
    }

    const servers = block.Servers.map(addr => tcp2ws(addr));

    return SkipChainService.getLatestBlock(servers, hex2buf(block.GenesisID))
      .then((data) => {
        this.blocks = data;
        this.updateGenesis();
      })
      .catch((e) => this.updateGenesis(e));
  }

}

export default new GenesisService()