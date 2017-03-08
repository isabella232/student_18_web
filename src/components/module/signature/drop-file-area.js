import React from 'react'

import './drop-file-area.css'

export default class DropFileArea extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      file: undefined
    };
    
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
    const {file} = this.state;
    console.log(file);
    
    const dropzone = file ? null : (
        <div className="drop-file-area"
             onClick={this.handleClick}
             onDrop={this.handleDrop}
             onDragOver={(e) => e.preventDefault()}>
          Drop or click to upload a file
        </div>
      );
    
    const resume = !file ? null : (
        <div className="drop-file-resume">
          {file.name}
        </div>
      );
    
    return (
      <div>
        <input type="file" ref="file-input" style={{display: "none"}} onChange={this.handleUpload}/>
        
        {dropzone || resume}
      </div>
    );
  }
  
  _handleFileDropped(files) {
    if (files.length > 0) {
      this.setState({
        file: files[0]
      });
    }
  }
}