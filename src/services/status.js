import CothorityWS from './websocket'
import GenesisService from './genesis'
import {tcp2ws} from '../utils/network'

const REFRESH_INTERVAL = 30000;

export class StatusService {

  status = {};
  listeners = [];

  servers = [];
  genesisList = [];

  constructor() {
    this.refreshInterval = REFRESH_INTERVAL;

    GenesisService.subscribe(this);
  }

  onGenesisUpdate(blocks, genesisList) {
    if (blocks.length === 0) {
      return;
    }

    this.status = {};
    this.servers = blocks.slice().pop().Roster.list.map(block => tcp2ws(block.address));
    this.genesisList = genesisList;

    this._updateStatus();
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
    return Object.keys(this.status).map(key => {
      return this.status[key];
    });
  }

  _updateStatus() {
    const self = this;

    this.servers.forEach((address, i) => CothorityWS.getStatus(address)
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
      listener.onStatusUpdate(this.status, this.genesisList);
    }
  }
}

export default new StatusService();