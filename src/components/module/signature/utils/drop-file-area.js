import React, {PropTypes as T} from 'react'
import FontAwesome from 'react-fontawesome'

import './drop-file-area.css'

/**
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 *
 * This component is used to drop a file or upload a file from the user's computer
 */
export default class DropFileArea extends React.Component {
  
  static propTypes = {
    onFileDrop: T.func
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  /**
   * Bubble the click of the user to the hidden input
   */
  handleClick() {
    this.refs['file-input'].click();
  }

  /**
   * Trigger the file upload event
   * @param e {Event}
   */
  handleUpload(e) {
    this._handleFileDropped(e.target.files);
  }

  /**
   * Trigger the file upload event
   * @param e
   */
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