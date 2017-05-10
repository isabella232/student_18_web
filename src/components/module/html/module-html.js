import React from 'react'
import ByteBuffer from 'bytebuffer'

import './module-html.css'
import Module from '../module'
import GenesisService from '../../../services/genesis'
import IFrameService from '../../../services/iframe'

/**
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 *
 * This module diplays the list of HTML skipchain. It shows only the ones with a base URL meaning that https://dedis.ch
 * will be shown but not https://dedis.ch/blabla
 */
export default class ModuleHTML extends React.Component {

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      genesisList: []
    };
  }

  /**
   * @see GenesisService._triggerEvent
   * @param blocks {Array}
   * @param genesisList {Array}
   */
  onGenesisUpdate(blocks, genesisList) {
    this.setState({
      genesisList: genesisList.filter(b => {
        const data = ByteBuffer.fromBase64(b.Data);
        if (data.capacity() > 18) {
          return data.toString('utf8').match(/https?:\/\/[^/]+$/);
        }

        return false;
      })
    });
  }

  /**
   * Open the HTML page with the given genesis ID
   * @param id {String} 64 hex-digits genesis ID
   */
  static handleOpenPage(id) {
    IFrameService.open(id)
  }

  componentWillMount() {
    GenesisService.subscribe(this);
  }

  componentWillUnmount() {
    GenesisService.unsubscribe(this);
  }

  render() {
    const {genesisList} = this.state;

    const rows = genesisList.map(block => {
      return (
        <div key={block.GenesisID} className="module-html-item" onClick={() => ModuleHTML.handleOpenPage(block.GenesisID)}>
          {ByteBuffer.fromBase64(block.Data).slice(18).toString('utf8')}
        </div>
      );
    });

    return (
      <Module title="HTML" icon="chain" className="module-html">
        {rows}
      </Module>
    );
  }
}