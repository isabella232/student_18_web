import React, {PropTypes as T} from 'react'

import './drop-file-area.css'

export default class DropFileArea extends React.Component {

  static propTypes = {
    onFileDropped: T.func
  };
  
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }
  
  handleClick() {
    this.refs['file-input'].click();
  }
  
  handleUpload(e) {
    this._handleFileDropped(e.target.files);
  }
  
  handleDrop(e) {
    e.preventDefault();
    
    this._handleFileDropped(e.dataTransfer.files);
  }
  
  render() {
    return (
      <div>
        <input type="file" ref="file-input" style={{display: "none"}} onChange={this.handleUpload}/>

        <div className="drop-file-area"
             onClick={this.handleClick}
             onDrop={this.handleDrop}
             onDragOver={(e) => e.preventDefault()}>
          Drop or click to upload a file
        </div>
      </div>
    );
  }
  
  _handleFileDropped(files) {
    const {onFileDropped} = this.props;

    if (files.length > 0 && typeof onFileDropped === 'function') {
      onFileDropped(files[0]);
    }
  }
}