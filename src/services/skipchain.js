import CothorityWS from './websocket'
import {buf2hex} from '../utils/buffer'
import CothorityLib from '@dedis/cothority'
import Genesis from './genesis'
import kyber from '@dedis/kyber-js'


const curve = new kyber.curve.edwards25519.Curve();
const net = CothorityLib.net;


/**
 * This service provide the function to get the list of blocks of the skipchain with the
 * underlying logic and verification
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 */


export class SkipChainService {

    /**
     * Given a list of servers and a genesis block id, try to get the latest block and return a promise that will resolve
     * with the list of server's addresses (WebSocket address)
     * @param {Array} servers
     * @param {String} genesisID
     * @returns {Promise}
     */
    getLatestBlock(servers, genesisID) {

        const id = CothorityLib;

        // create empty array of ServerID
        let serverIDs = [];

        console.log('1',curve instanceof kyber.Group);

        // initialize public key
        let publicKey;

        for (let i = 0; i < servers.length; i++) {
            publicKey = this.getPubKey(servers[i]);


            serverIDs[i] = new id.ServerIdentity(curve, curve.point().pick(), "tcp://" + servers[i], null);

            //serverIDs[i] = new id.ServerIdentity(curve, publicKey, "tcp://" + servers[i], null);
        }

        console.log('11', serverIDs);

        //console.log(serverIDs);
        const roster = new id.Roster(curve, serverIDs, null);

        const sc = CothorityLib.skipchain;
        const client = new sc.Client(curve, roster, Genesis.curr_genesis);

        return client.getLatestBlock();
    }

    /**
     * @param {String} nodeip: node IP address
     * @returns {Uint8Array} the public key of the given node
     */
    getPubKey(nodeip) {

        //console.log(tcp2ws(nodeip));
        //console.log(nodeip);

        // create a 'Status' socket with the given cothority server
        const socket = new net.Socket("ws://" + nodeip, "Status");

        // initialize public key
        let publicKey = new Uint8Array(0);

        // send Status request and extract public key
        socket.send("Request", "Response", {})
            .then(data => {
                publicKey = data.server.public;

                console.log('publicKey instanceof Uint8Array', publicKey instanceof Uint8Array);
            })
            .catch(err => {
                console.error(err);
            });

        return publicKey;
    }

    /**
     * Try to get the update list of skipblocks from an address and a genesis block id
     * Parse the response to resolve the promise with the list of WebSocket addresses of the servers
     * @param {String} address - ws address to try
     * @param {String} genesisID - Hex representation of the genesis block id
     * @returns {Promise.<Array>|*}
     * @private
     */
    _getUpdates(address, genesisID) {
        return CothorityWS.getLatestBlock(address, genesisID).then(
            (response) => {
                if (!response.Update) {
                    throw new Error("Malformed response");
                }

                //if (!this._verifyUpdates(response.Update)) {
                //  throw new Error("Update blocks are corrupted");
                //}

                return response.Update;
            }
        );

    }

    /**
     * Check the sanity of the skip blocks and return false if an error occurred
     * @param {Array} blocks
     * @returns {boolean}
     * @private
     */
    _verifyUpdates(blocks) {
        return blocks.every((block, blockIndex) => {

            // const hash = cryptoJS.hashSkipBlock(block); // eslint-disable-line
            //
            // // Check the hash of the block
            // if (buf2hex(hash) !== buf2hex(block.Hash)) {
            //   console.log("Wrong hash for block", blockIndex, block);
            //   // return false;
            // }
            //
            // block._hash_verified = true;

            // Check the forward links
            // const publicKeys = block.Roster.list.map(server => server.public);
            let isSignatureVerified = true;

            block.ForwardLink.forEach(link => {
                console.log("check signature for block", blockIndex, block);
                var res;
                try {
                    res = CothorityLib.verifyForwardLink(block.Roster.list, { // eslint-disable-line
                        from: link.from,
                        to: link.to,
                        signature: link.signature
                    })
                }

                catch (error) {
                    console.log(error)
                }
                console.log(res);
                if (!res) {
                    console.log("Wrong signature for block", blockIndex, block);
                    isSignatureVerified = false;
                } else {
                    console.log("OK signature for block", blockIndex, block);
                }
            });

            block._signature_verified = isSignatureVerified;
            if (!isSignatureVerified) {
                return false;
            }

            if (blockIndex > 0) { // Genesis back link is random
                for (let i = 0; i < block.BackLinkIDs.length; i++) {
                    const link = buf2hex(block.BackLinkIDs[i]);

                    const prev = blocks.filter(b => buf2hex(b.Hash) === link && block !== b).pop();
                    if (prev && (!prev._signature_verified || !prev._backlink_verified)) {
                        console.log("Back link is corrupted");
                        return false;
                    }
                }
            }

            block._backlink_verified = true;

            return true;
        });

    }

}

export default new SkipChainService();
