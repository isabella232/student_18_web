import React, {PropTypes as T} from 'react'
import {Button} from 'reactstrap'
import FontAwesome from 'react-fontawesome'

import './sign-area.css'
import {hashFile} from '../../../utils/file'
import {buf2hex} from '../../../utils/buffer'
import {tcp2ws} from '../../../utils/network'
import CothorityWebsocket from '../../../services/websocket'
import GenesisService from '../../../services/genesis'

export default class SignArea extends React.Component {

  static propTypes = {
    file: T.instanceOf(File).isRequired,
    onBack: T.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isSigning: false,
      error: '',

      latestBlock: null,
      genesisID: ''
    };

    this.handleBackAction = this.handleBackAction.bind(this);
    this.handleSign = this.handleSign.bind(this);
  }

  componentWillMount() {
    GenesisService.subscribe(this);
  }

  componentWillUnmount() {
    GenesisService.unsubscribe(this);
  }

  onGenesisUpdate(blocks, genesisList, currGenesis) {
    this.setState({
      genesisID: currGenesis,
      block: blocks.slice().pop()
    });
  }

  onGenesisError(error) {
    this.setState({
      error: error.message
    });
  }

  handleBackAction() {
    this._triggerOnBack();
  }

  /**
   * Send a sign request over WS with the current loaded file
   */
  handleSign() {
    this.setState({
      isSigning: true
    });

    const {file} = this.props;
    // We assume we have a valid genesis ID and the associated block
    // else an error will be displayed before letting the user sign
    const {genesisID, block} = this.state;

    const servers = block.Roster.list.slice();

    this._signPromise = new Promise((resolve, reject) => {
      hashFile(file).then(
        (hash) => {
          const address = tcp2ws(servers[0].address);

          if (address.length > 0) {
            CothorityWebsocket.getSignature(hash, address, servers)
              .then(
                (response) => {
                  const signature = (response.signature || []).slice(0, 64);

                  this._generateSignatureFile(signature, file, hash, genesisID, buf2hex(block.Hash));
                  this._triggerOnBack();

                  resolve();
                }
              )
              .catch(() => {
                reject('Oops, something went wrong...');
              })
          }
        }
      );
    });

    // We want to display the error message if it occurs
    this._signPromise.catch(e => this.setState({error: e}));
  }

  render() {
    const {error} = this.state;
    if (error.length > 0) {
      return (
        <div className="sign-area">
          <div className="sign-area-error">{error}</div>
          <div className="sign-area-action">
            <Button color="danger" onClick={this.handleBackAction}>Ok</Button>
          </div>
        </div>
      );
    }

    const {file} = this.props;
    const size = (file.size / (1024 * 1024)).toFixed(2);

    const {isSigning} = this.state;
    const signAction = isSigning ? <div className="loading"><FontAwesome name="circle-o-notch" size="2x" spin/></div> :
      <Button color="success" onClick={this.handleSign}>Sign</Button>;

    return (
      <div className="sign-area">
        <div className="sign-area-file">
          <div><strong>Name</strong> {file.name}</div>
          <div><strong>Size</strong> {size}MB</div>
        </div>
        <div className="sign-area-action">
          <Button color="danger" onClick={this.handleBackAction}>Back</Button>
          {signAction}
        </div>
      </div>
    );
  }

  /**
   * Generate and download a file with the different information about the signature
   * @param signature {Uint8Array} signature returned by the server
   * @param file {File} file to be signed
   * @param hash {Uint8Array} Hash of the file
   * @param genesisID {String} genesisID hexlify
   * @param blockID {String} block ID hexlify
   * @private
   */
  _generateSignatureFile(signature, file, hash, genesisID, blockID) {
    const body = {
      filename: file.name,
      signature: buf2hex(signature),
      hash: buf2hex(hash),
      genesisID,
      blockID
    };

    saveAs(new Blob([JSON.stringify(body, null, '\t')]), `signature_${Date.now()}.json`); // eslint-disable-line
  }

  _triggerOnBack() {
    const {onBack} = this.props;
    if (typeof onBack === 'function') {
      onBack();
    }
  }
}