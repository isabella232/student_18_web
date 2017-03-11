import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Row, Col} from 'reactstrap'

import './module-verify.css'
import Module from '../module'
import DropFileArea from './drop-file-area'
import {readAsString, hashFile} from '../../../utils/file'
import {hex2buf} from '../../../utils/buffer'

export default class VerifyModule extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      file: undefined,
      isVerified: false,
      isSignatureCorrect: false,
      error: ''
    };
    
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }
  
  handleFileDrop(fileDropped) {
    const {file, isVerified} = this.state;
    
    if (!file || (!!file && isVerified)) {
      // Either the file hasn't been uploaded yet or we have already verified the previous one
      this.setState({
        file: fileDropped,
        isVerified: false,
        isSignatureCorrect: false
      });
      return;
    }
    
    this._verifySignature(fileDropped);
  }
  
  render() {
    const feedback = this._generateFeedback();
    
    return (
      <Module className="module-verify" title="Verify" icon="unlock">
        <Row>
          <Col xs="6"><DropFileArea onFileDrop={this.handleFileDrop}/></Col>
          <Col xs="6">
            <div className="module-verify-feedback">
              <ReactCSSTransitionGroup transitionName="feedback"
                                       transitionLeaveTimeout={1}
                                       transitionEnterTimeout={300}>
                {feedback}
              </ReactCSSTransitionGroup>
            </div>
          </Col>
        </Row>
      </Module>
    );
  }
  
  _generateFeedback() {
    const {file, isVerified, isSignatureCorrect, error} = this.state;
    
    if (error.length > 0) {
      return <p key="step-error" className="has-error">{error}</p>
    }
    else if (!file) {
      return <p key="step-1">1. Upload the file</p>
    }
    else if (!isVerified) {
      return <p key="step-2">2. Upload the signature file</p>
    }
    else {
      return <p key="step-3">{isSignatureCorrect ? 'Yes!' : 'Hmm...'}</p>
    }
  }
  
  /**
   * Check the signature
   * @param infoFile {File}
   * @private
   */
  _verifySignature(infoFile) {
    const {file} = this.state;
  
    this._verifyPromise = new Promise((resolve, reject) => {
      readAsString(infoFile).then(
        (info) => {
          hashFile(file)
            .then(
              (hash) => {
                try {
                  info = JSON.parse(info);
              
                  const pubkey = hex2buf(info.public_key);
                  const signature = hex2buf(info.signature);
              
                  this.setState({
                    error: '',
                    isVerified: true,
                    isSignatureCorrect: cryptoJS.verify(pubkey, hash, signature) // eslint-disable-line
                  });
                  
                  resolve();
                } catch (e) {
                  this.setState({
                    error: 'The json file is unreadable. Please make sure you provided the correct signature file.'
                  });
                  
                  reject();
                }
              }
            );
        }
      );
    });
  }
}