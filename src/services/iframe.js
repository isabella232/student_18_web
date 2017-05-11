import './iframe.css'
import GenesisService from '../services/genesis'
import ByteBuffer from 'bytebuffer'

/**
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 *
 * This service displays an HTML skipchain using the genesis ID of the page you want to open. It also listen
 * the message events to know when the IFrame wants to change the page
 */
export class IFrameService {

  /**
   * 1. Get the html node for the service
   * 2. Add a listener to message event
   * @constructor
   */
  constructor() {
    window.addEventListener('message', (e) => {
      e.data = e.data || '';
      if (e.data.indexOf("skipchain://") === 0) {
        this.open(e.data.replace("skipchain://", ""));
      }
    });
  }

  /**
   * Fetch and display the page of the skipchain with the given genesis ID
   * @param id {String} 64 hex-digits ID of the genesis block
   */
  open(id) {

    return GenesisService.getLatestFromGenesisID(id).then((block) => {
      const data = ByteBuffer.wrap(block.Data);
      // buffer can have some issues to decode into UTF-8 so we force the decoding by hand
      let html = hexToUTF8(data.toHex());
      html = html.substr(html.indexOf('<!'));

      const root = this._getRoot();
      if (root) {
        root.className = "active";
        root.innerHTML = `<div>
            DEDIS WebSite Emulator
            <span><a onclick="window.IFrameService.back()" href="#">Back</a></span>
        </div>
        <iframe src="data:text/html;base64,${btoa(html)}"></iframe>`
      }
    });
  }

  /**
   * Hide the website emulator
   */
  back() {
    const root = this._getRoot();

    root.className = "";
    root.innerHTML = "";
  }

  _getRoot() {
    return document.getElementById('block-iframe');
  }

}

const service = new IFrameService();

window.IFrameService = service;

export default service;

/**
 * Translate char by char a sequence of hex digit to UTF-8 digit
 * @param str
 * @returns {string}
 */
function hexToUTF8(str) {
  const hexes = str.match(/.{1,2}/g) || [];
  let back = "";
  for (let j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}