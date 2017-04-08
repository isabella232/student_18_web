import Moment from 'moment'
import {buf2hex, hex2buf} from '../utils/buffer'

export default class SignatureFile {
  filename = null;
  signature = null;
  hash = null;
  genesisID = null;
  blockID = null;
  offlineServers = null;

  setFileName(name) {
    this.filename = name;
  }

  getFilename() {
    return this.filename;
  }

  setSignature(signature) {
    this.signature = buf2hex(signature);
  }

  getSignature() {
    return hex2buf(this.signature);
  }

  setHash(hash) {
    this.hash = buf2hex(hash);
  }

  getHash(hex = false) {
    return hex ? this.hash : hex2buf(this.hash);
  }

  setGenesisID(id) {
    if (typeof id !== 'string') {
      id = buf2hex(id);
    }

    this.genesisID = id;
  }

  getGenesisID(hex = false) {
    return hex ? this.genesisID : hex2buf(this.genesisID);
  }

  setBlockID(id) {
    if (typeof id !== 'string') {
      id = buf2hex(id);
    }

    this.blockID = id;
  }

  getBlockID(hex = false) {
    return hex ? this.blockID : hex2buf(this.blockID);
  }

  setOfflineServers(servers) {
    this.offlineServers = servers;
  }

  getOfflineServers() {
    return this.offlineServers;
  }

  save() {
    const body = {
      filename: this.filename,
      signature: this.signature,
      hash: this.hash,
      genesisID: this.genesisID,
      blockID: this.blockID,
      offlineServers: this.offlineServers || []
    };

    const date = Moment().format("YYYY-MM-DD-hh-mm-ss");
    saveAs(new Blob([JSON.stringify(body, null, '\t')]), `signature_${date}.json`); // eslint-disable-line
  }

  parse(content) {
    let data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      throw new Error("Signature file malformed");
    }

    if (!data.genesisID || !data.blockID || !data.hash || !data.signature) {
      throw new Error("Missing data in signature file.");
    }

    this.filename = data.filename || '';
    this.signature = data.signature;
    this.hash = data.hash;
    this.genesisID = data.genesisID;
    this.blockID = data.blockID;
    this.offlineServers = data.offlineServers || [];
  }
}