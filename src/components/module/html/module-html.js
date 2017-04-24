import React from 'react'
import ByteBuffer from 'bytebuffer'

import './module-html.css'
import Module from '../module'
import GenesisService from '../../../services/genesis'
import IFrameService from '../../../services/iframe'

export default class ModuleHTML extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      genesisList: []
    };

    this.handleOpenPage = this.handleOpenPage.bind(this);
  }

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

  handleOpenPage(id) {
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
        <div key={block.GenesisID} className="module-html-item" onClick={() => this.handleOpenPage(block.GenesisID)}>
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