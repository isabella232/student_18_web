import React, {PropTypes as T} from 'react'
import {Row, Col, Button} from 'reactstrap'

import './sign-area.css'
import {hashFile} from '../../../utils/file'
import CothorityWebsocket from '../../../services/websocket'
import CothorityStatus from '../../../services/status'

export default class SignArea extends React.Component {

  static propTypes = {
    file: T.instanceOf(File).isRequired,
    onBack: T.func
  };

  constructor(props) {
    super(props);

    this.service = new CothorityStatus();

    this.handleBackAction = this.handleBackAction.bind(this);
    this.handleSign = this.handleSign.bind(this);
  }

  handleBackAction() {
    const {onBack} = this.props;
    if (typeof onBack === 'function') {
      onBack();
    }
  }

  /**
   * Send a sign request over WS with the current loaded file
   */
  handleSign() {
    const {file} = this.props;

    hashFile(file).then(
      (hash) => {
        const address = this.service.getAvailableServerAddress();
        const roster = this.service.getAvailableRoster();

        if (address.length > 0) {
          CothorityWebsocket.getSignature(hash, address, roster)
            .then(
              (response) => {
                console.log(response);
              }
            )
            .catch((e) => console.log(e))
        }
        else {
          // Todo : notification
        }
      }
    );
  }

  render() {
    const {file} = this.props;

    return (
      <Row className="sign-area">
        <Col xs="12" className="sign-area-title">
          {file.name}
        </Col>
        <Col xs="6" className="sign-area-action">
          <Button color="danger" onClick={this.handleBackAction}>Back</Button>
        </Col>
        <Col xs="6" className="sign-area-action">
          <Button color="success" onClick={this.handleSign}>Sign</Button>
        </Col>
      </Row>
    );
  }
}