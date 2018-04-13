import 'whatwg-fetch'
import SkipChainService from './skipchain'
import {hex2buf, buf2hex} from '../utils/buffer'
import {tcp2ws} from '../utils/network'

const LOCAL_TEST = true;

const LEO = true;

var GENESIS_BLOCK_SERVER = "";



/**
 * This service will contact the DEDIS server to get the list of skipchains with their servers. Those servers may
 * not be available.
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 */
export class GenesisService {

    /**
     * Make a request to the GENESIS_BLOCK_SERVER url to get the list of genesis IDs of the skipchains
     * @constructor
     */
    constructor() {

        if (LOCAL_TEST) {
            //PERSONAL CONSTRUCTOR

            let LOCAL_BLOCK;
            if(LEO) {
                LOCAL_BLOCK = [
                    {"SkipchainID":"df4ed9f67413a57d7e52c5927bd0df85ecff5319e0fb71acc2542177fbffadb3",
                        "Servers":["localhost:7002","localhost:7004","localhost:7006"],
                        "Data":"jlqD4y8SVW+1GklxrGzPFggEEj8SGXRzZi00ODQtd3BhLTAtMTcyLmVwZmwuY2gaIgogikjlNykJi0fKSOriwqZQtJI/qq50g/zS8ybDjIf8F0EingIKEMKgf63FyUrMsb/91xYhrfQSTAogqrpLaHUIP8zTb129WsveKe5iK6FDxEVlPZMYbWzwgvcSEPuf5UC8TVydtFeVyti9u98aFHRsczovL2xvY2FsaG9zdDo3MDAyIgASTAogPgZWWmxKJ5hglEUoPCsNLfq1C255rK0rOTUdLCNW1B0SEGhbMkdq3lp9lg2oYY3WcnwaFHRsczovL2xvY2FsaG9zdDo3MDA0IgASTAogklCU0O3dYZ1vZ+FeITsvjRaRHOa0J1554FR62uqwDMwSEGfxBwgaV11uo+HKCsutbOoaFHRsczovL2xvY2FsaG9zdDo3MDA2IgAaIEWd6YSeFu+gjWeaGnaU+Xzcys+klX5G5cNCcPkMVeFG"}];
            }

            else {
                LOCAL_BLOCK = [
                    {"SkipchainID":"3fbc30e54ef45e55ddb92f3a8924a13b5afa7d55b2bef74f2322ec75244aaf0f",
                        "Servers":["localhost:7002","localhost:7004","localhost:7006"],
                        "Data":"jlqD4y8SVW+1GklxrGzPFggEEj8SGXRzZi00ODQtd3BhLTYtMTI0LmVwZmwuY2gaIgog/AvCpWALsAFGsdl777JNf//k8kl/+iglkcjZpyVeMckingIKEPdD4GtbdUy3vUw+2TkmHW4STAogjcx+aVED3TTrY7ABGNBvuTMkCt9ftdTg+b3fUVKXA+QSEH8gzY6e+lr6n61092pgV1EaFHRsczovL2xvY2FsaG9zdDo3MDAyIgASTAogvP7EFlwvTYbLmjMGRWF6CP2KlEzyM0HDqpqH3yUeknISEGgVT+k17VjviUPyYFsPDv4aFHRsczovL2xvY2FsaG9zdDo3MDA0IgASTAogm3EC2QEaCeocqPrrcIiLs1aEAB2lWAvTdsaZsrR8630SEJMoL54fOF2pk5irbTTgx9waFHRsczovL2xvY2FsaG9zdDo3MDA2IgAaIFm5Pufz3EMz74amA8ZNygFcUAUCaSs/Bynyc3Pfn5bT"}];
            }

            this.listeners = [];
            this.genesisList =  LOCAL_BLOCK;
            this.curr_genesis = getFirstSkipChain(this.genesisList); // hex form
            this.blocks = [];
            this._request = this._fetchStatusForSkipchainID(this.curr_genesis);

        } else {
            // GENERAL CONSTRUCTOR

            GENESIS_BLOCK_SERVER =  "~/go/src/github.com/dedis/cothority/scmgr/www/";

            const GENESIS_BLOCK_FILE = "index.js";
            // Get the servers list and the genesis block id
            this.listeners = [];
            this.genesisList = [];
            this.curr_genesis = ''; // hex form
            this.blocks = [];

            this._fetch_request = fetch(GENESIS_BLOCK_SERVER + GENESIS_BLOCK_FILE)
                .then(
                    (response) => response.json().then(data => {
                        // We keep the list of available blocks
                        console.log("got index.js");
                        this.genesisList = data.Blocks;
                        this.curr_genesis = getFirstSkipChain(this.genesisList);

                        this._request = this._fetchStatusForSkipchainID(this.curr_genesis);
                    })
                )
                .catch((error) => {
                    this.updateGenesis(new Error("Failed to get the list of Genesis blocks."));
                });
        }
    }

    /**
     * Add the given listener to the list of object which will be called on update events
     * @param {Object} listener must have onGenesisUpdate function to get the updates
     */
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

    /**
     * Remove the given listener from the list
     * @param {Object} listener
     */
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Trigger either an update or an error update
     * @param {Error} error a potential error that triggered
     */
    updateGenesis(error) {
        if (error) {
            this.error = error;
            this.listeners.forEach(listener => this._triggerError(listener));
        }
        else {
            this.listeners.forEach(listener => this._triggerEvent(listener));
        }
    }

    /**
     * Change the current skipchain given the ID of the genesis block
     * @param {String} id hex form of the ID
     */
    setCurrentSkipchainID(id) {
        const block = this.genesisList.filter(b => b.SkipchainID === id).pop();
        if (block) {
            // if the id exists we fetch the skipchain
            this.curr_genesis = id;
            this._request = this._fetchStatusForSkipchainID(id);
        }
    }

    /**
     * Given a genesis ID and a block ID, it will get the servers of the skipchain and then fetch the list of
     * blocks of the skipchain to finally return the block if it exists
     * If the block ID is not provided, we return the latest block
     * @param {String} id - Genesis ID
     * @param {String} blockID - 64 hex-digits Block ID
     * @returns {Promise}
     */
    getLatestFromSkipchainID(id, blockID = null) {
        return new Promise((resolve, reject) => {
            fetch(GENESIS_BLOCK_SERVER + id + '.js', {headers: {'Content-Type': 'application/json'}})
                .then(
                    (response) => response.json().then(data => {
                        SkipChainService.getLatestBlock(data.Servers.map(addr => tcp2ws(addr)), hex2buf(id))
                            .then(data => {
                                if (blockID) {
                                    const block = data.filter(block => buf2hex(block.Hash) === blockID).pop();
                                    block ? resolve(block) : reject();
                                }
                                else {
                                    resolve(data.pop());
                                }
                            })
                            .catch(e => reject(e));
                    })
                )
                .catch(e => reject(e));
        });
    }

    /**
     * Trigger an update event to the listener with params:
     *  1. blocks The list of blocks of the skipchain
     *  2. genesisList The current list of available skipchains
     *  3. curr_genesis The current genesis ID of the current skipchain
     * @param {object} listener - An object with a declaration of onGenesisUpdate
     * @private
     */
    _triggerEvent(listener) {
        if (typeof listener.onGenesisUpdate === 'function') {
            listener.onGenesisUpdate(this.blocks, this.genesisList, this.curr_genesis);
        }
    }

    /**
     * Trigger an error event
     * @param {Object} listener
     * @private
     */
    _triggerError(listener) {
        if (typeof listener.onGenesisError === 'function') {
            listener.onGenesisError(this.error);
        }
    }

    /**
     * It will check that the skipchain exists and then it gets the list of blocks. Finally
     * it trigger according to the result either an update or an error
     * @param {String} id - The genesis ID
     * @private
     */
    _fetchStatusForSkipchainID(id) {
        const block = this.genesisList.filter(b => b.SkipchainID === id).pop();
        if (!block) {
            return this.updateGenesis(new Error("Cannot find the block associated with the genesis ID"));
        }

        const servers = block.Servers.map(addr => tcp2ws(addr));

        return SkipChainService.getLatestBlock(servers, hex2buf(block.SkipchainID))
            .then((data) => {
                this.blocks = data;
                this.updateGenesis(null);
            })
            .catch((e) => this.updateGenesis(e));
    }
}

export default new GenesisService()

function getFirstSkipChain(list) {
    return list[0].SkipchainID;

    /*
    for (let i = 0; i < list.length; i++) {
	const block = list[i];

	if (!ByteBuffer.fromBase64(block.Data).toString('utf8').match(/^(https?|config):\/\//)) {
	    return block.SkipchainID;
	}
    }

    return '';
    */
}
