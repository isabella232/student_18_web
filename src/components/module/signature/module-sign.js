import React from 'react'

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
      <SignArea file={file} onBack={this.handleBack}/> :
      <FileDropArea onFileDropped={this.handleFileDropped}/>;

    return (
      <Module className="module-sign" title="Sign a file">
        {body}
      </Module>
    );
  }
}