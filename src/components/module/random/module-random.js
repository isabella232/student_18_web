import React from 'react'

import './module-random.css'
import Module from '../module'
import WebSocketService from '../../../services/websocket'
import {buf2hex} from '../../../utils/buffer'

const REFRESH_RANDOM_INTERVAL = 30 * 1000;
const REFRESH_COUNTER_INTERVAL = 100;

export default class ModuleRandom extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      random: ''
    };
  }

  componentWillMount() {
    this._triggerRandomUpdate();
  }

  render() {
    const {random, counter} = this.state;

    return (
      <Module title="Random" icon="random" className="module-random">
        <strong>Random number</strong><br/>
        {random}

        <div className="module-random-counter">
          <div style={{width: `${counter * 100}%`}}/>
        </div>
      </Module>
    );
  }

  _triggerRandomUpdate() {
    WebSocketService.getRandom('192.33.210.8:7021').then(msg => {
      this._timestamp = Date.now();
      this.setState({
        random: buf2hex(msg.R),
        counter: 0
      });

      const self = this;
      setTimeout(() => self._checkCountDown(), REFRESH_COUNTER_INTERVAL);
    });
  }

  _checkCountDown() {
    // counter from 0 to 1
    const counter = Math.min(1, (Date.now() - this._timestamp) / REFRESH_RANDOM_INTERVAL);

    this.setState({counter});

    if (counter < 1) {
      setTimeout(() => this._checkCountDown(), REFRESH_COUNTER_INTERVAL);
    }
    else {
      this._triggerRandomUpdate();
    }
  }

}