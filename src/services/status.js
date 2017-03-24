import CothorityWS from './websocket'
import SkipChainService from './skipchain'
import {hex2buf} from '../utils/buffer'

const REFRESH_INTERVAL = 30000;

export class StatusService {

  status = {};
  listeners = [];
  servers = [];

  constructor() {
    this.refreshInterval = REFRESH_INTERVAL;

    // Get the servers list and the genesis block id
    fetch('http://skipchain.dedis.ch', {headers: {'Content-Type': 'application/json'}})
      .then(
        (response) => response.json().then(data => {
          SkipChainService.getLatestBlock(data.servers, hex2buf(data.genesisBlockID))
            .then(
              (servers) => {
                this.servers = servers;
                this._updateStatus();
              }
            )
            .catch((e) => console.log('Oops', e));
        })
      )
      .catch(e => console.log(e));
  }

  triggerUpdate() {
    this.listeners.forEach((listener) => {
      this._triggerEvent(listener);
    });
  }

  subscribe(listener) {
    if (this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener);

      this._triggerEvent(listener);
    }
  }

  unsubscribe(listener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  getAvailableRoster() {
    return Object.keys(this.status)
      .filter((address) => !!this.status[address].system)
      .map((address) => {
        return {
          address,
          server: this.status[address].server
        };
      });
  }

  _updateStatus() {
    const self = this;

    this.servers.forEach((address) => CothorityWS.getStatus(address)
      .then((response) => {
        response.timestamp = Date.now();
        self.status[address] = response;
        self.triggerUpdate();
      })
      .catch(() => {
        self.status[address] = {
          timestamp: Date.now(),
          server: {address}
        };
        self.triggerUpdate();
      })
    );

    setTimeout(() => self._updateStatus(), self.refreshInterval);
  }

  _triggerEvent(listener) {
    if (typeof listener.onStatusUpdate === 'function') {
      listener.onStatusUpdate(this.status);
    }
  }
}

export default new StatusService();