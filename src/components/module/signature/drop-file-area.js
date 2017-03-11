import React, {PropTypes as T} from 'react'
import FontAwesome from 'react-fontawesome'

import './drop-file-area.css'

export default class DropFileArea extends React.Component {
  
  static propTypes = {
    onFileDrop: T.func
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
      <div className="drop-file-area">
        <input type="file" ref="file-input" style={{display: "none"}} onChange={this.handleUpload}/>
  
        <div className="drop-file-container"
             onClick={this.handleClick}
             onDrop={this.handleDrop}
             onDragOver={(e) => e.preventDefault()}>
          
          <FontAwesome name="download"/><br/>
          Click or drop a file
        </div>
      </div>
    );
  }
  
  /**
   * Trigger the file dropped event with the given file
   * @param files {Array}
   * @private
   */
  _handleFileDropped(files) {
    const {onFileDrop} = this.props;

    if (files.length > 0 && typeof onFileDrop === 'function') {
      onFileDrop(files[0]);
    }
  }
}