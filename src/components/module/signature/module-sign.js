import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Module from '../module'
import FileDropArea from './drop-file-area'
import SignArea from './sign-area'

export default class BlockSign extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: undefined
    };

    this.handleFileDropped = this.handleFileDropped.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleFileDropped(file) {
    this.setState({
      file
    });
  }

  handleBack() {
    this.setState({file: undefined});
  }

  render() {
    const {file} = this.state;
    const body = file ?
      <SignArea key="sign-area" file={file} onBack={this.handleBack}/> :
      <FileDropArea key="file-drop-area" onFileDrop={this.handleFileDropped}/>;

    return (
      <Module className="module-sign" title="Sign a file" icon="lock">
        <ReactCSSTransitionGroup transitionName="module"
                                 transitionLeaveTimeout={1}
                                 transitionEnterTimeout={300}>
          {body}
        </ReactCSSTransitionGroup>
      </Module>
    );
  }
}