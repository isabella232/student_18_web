import './iframe.css'
import GenesisService from '../services/genesis'
import ByteBuffer from 'bytebuffer'

class IFrameService {

  _root = null;

  constructor() {
    this._root = document.getElementById('block-iframe');

    window.addEventListener('message', (e) => {
      console.log(e);
      if (e.data.indexOf("skipchain://") === 0) {
        this.open(e.data.replace("skipchain://", ""));
      }
    });
  }

  open(id) {

    GenesisService.getLatestFromGenesisID(id).then((block) => {
      const data = ByteBuffer.wrap(block.Data);
      // buffer can have some issues to decode into UTF-8 so we force the decoding by hand
      let html = hexToUTF8(data.toHex());
      html = html.substr(html.indexOf('<!'));

      this._root.className = "active";
      this._root.innerHTML = `<div>
            DEDIS WebSite Emulator
            <span><a onclick="window.IFrameService.back()" href="#">Back</a></span>
        </div>
        <iframe src="data:text/html;base64,${btoa(html)}"></iframe>`
    });
  }

  back() {
    this._root.className = "";
    this._root.innerHTML = "";
  }

}

const service = new IFrameService();

window.IFrameService = service;

export default service;

function hexToUTF8(str){
  var j;
  var hexes = str.match(/.{1,2}/g) || [];
  var back = "";
  for(j = 0; j<hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}