import React from 'react'

import './html-iframe.css'
import IFrameService from '../../services/iframe'

/**
 * @author Gaylor Bosson (galor.bosson@epfl.ch)
 *
 * Show a fixed IFrame when the user click on an HTML skipchain
 */
export default class HTMLIFrame extends React.Component {

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      html: null
    };

    this.handleBack = this.handleBack.bind(this);
  }

  /**
   * update the html state to show the content in the iframe
   * @param html
   */
  onOpenHTML(html) {
    this.setState({html});
  }

  /**
   * Reset the content of the html state to hide the iframe
   */
  onCloseHTML() {
    this.setState({
      html: null
    });
  }

  /**
   * Handle the back action
   */
  handleBack() {
    IFrameService.back();
  }

  componentWillMount() {
    IFrameService.subscribe(this);
  }

  componentWillUnmount() {
    IFrameService.unsubscribe(this);
  }

  render() {
    const {html} = this.state;

    if (!html) {
      return null;
    }

    return (
      <div className="block-iframe">
        <div>
          DEDIS WebSite Emulator
          <span><a href="#" onClick={this.handleBack}>Back</a></span>
        </div>
        <iframe src={`data:text/html;base64,${btoa(html)}`}></iframe>
      </div>
    );
  }
}