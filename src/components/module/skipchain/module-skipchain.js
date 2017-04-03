import React from 'react'
import Module from '../module'
import {FormGroup, Label, Input} from 'reactstrap'
import {Scrollbars} from 'react-custom-scrollbars';

import './module-skipchain.css'
import GenesisService from '../../../services/genesis'

export default class ModuleSkipChain extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      genesisList: [],
      currGenesis: ''
    };

    this.handleGenesisChange = this.handleGenesisChange.bind(this);
  }

  onGenesisUpdate(blocks, genesisList, curr_genesis) {
    this.setState({
      blocks: blocks,
      genesisList,
      currGenesis: curr_genesis
    });
  }

  onGenesisError(error) {
    this.setState({error});
  }

  handleGenesisChange(id) {
    const {currGenesis} = this.state;

    if (id !== currGenesis) {
      GenesisService.setCurrentGenesisID(id);
    }
  }

  componentWillMount() {
    GenesisService.subscribe(this);
  }

  componentWillUnmount() {
    GenesisService.unsubscribe(this);
  }

  render() {
    const {genesisList, currGenesis, error} = this.state;

    if (error) {
      return this._renderError(error);
    }

    const rows = genesisList.map(b => {
      return (
        <FormGroup key={b.GenesisID} check>
          <Label check>
            <Input type="radio" name="radio1" checked={b.GenesisID === currGenesis}
                   onChange={() => this.handleGenesisChange(b.GenesisID)}/>{' '}
            {b.GenesisID.substr(0, 10)}
          </Label>
        </FormGroup>
      );
    });

    return (
      <Module title="SkipChain" icon="chain" className="module-skip-chain">
        <Scrollbars style={{height: "100%"}}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
          {rows}
        </Scrollbars>
      </Module>
    );
  }

  _renderError(error) {
    return (
      <Module title="SkipChain" icon="chain" className="module-skip-chain">
        <p className="has-error">
          {error.message}
        </p>
      </Module>
    );
  }

}