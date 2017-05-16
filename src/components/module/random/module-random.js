import React, {PropTypes as T} from 'react'

import './module-random.css'
import Module from '../module'
import WebSocketService from '../../../services/websocket'
import {buf2hex} from '../../../utils/buffer'

const REFRESH_RANDOM_INTERVAL = 30 * 1000;
const REFRESH_COUNTER_INTERVAL = 100;

/**
 * This module will ask for a random number every fixed interval and display the result
 *
 * The count down is shown with a kind of loading bar
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 */
export default class ModuleRandom extends React.Component {

  static propTypes = {
    randomRefreshInterval: T.number
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      random: '',
      counter: 0,
      error: null,
      randomRefreshInterval: props.randomRefreshInterval || REFRESH_RANDOM_INTERVAL,
    };
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   */
  componentWillMount() {
    this._triggerRandomUpdate();
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   * @returns {XML}
   */
  render() {
    const {random, error, counter} = this.state;

    return (
      <Module title="Random" icon="random" className="module-random">
        <strong>Random number</strong><br/>
        {
          error ? <p className="has-error">{error}</p> : random
        }

        <div className="module-random-counter">
          <div style={{width: `${counter * 100}%`}}/>
        </div>
      </Module>
    );
  }

  /**
   * Send a random request to the server and update the state with the result number
   * @private
   */
  _triggerRandomUpdate() {
    WebSocketService.getRandom('pulsar.dedis.ch:9000')
      .then(msg => {
        this._timestamp = Date.now();
        this.setState({
          random: buf2hex(msg.R),
          counter: 0
        });

        const self = this;
        setTimeout(() => self._checkCountDown(), REFRESH_COUNTER_INTERVAL);
      })
      .catch((e) => {
        console.error(e);

        this.setState({
          error: 'Oops, something went wrong.'
        });
      });
  }

  /**
   * This function will recursively call itself until the counter is reached to update the loading
   * animation. When the counter reached 1, it will trigger an update
   * @private
   */
  _checkCountDown() {
    const {randomRefreshInterval} = this.state;

    // counter from 0 to 1
    const counter = Math.min(1, (Date.now() - this._timestamp) / randomRefreshInterval);

    this.setState({counter});

    if (counter < 1) {
      setTimeout(() => this._checkCountDown(), REFRESH_COUNTER_INTERVAL);
    }
    else {
      this._triggerRandomUpdate();
    }
  }

}