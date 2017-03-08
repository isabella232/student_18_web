import React from 'react'
import FontAwesome from 'react-fontawesome'

import './module.css'

export default class Module extends React.Component {
  render() {
    const className = `module ${this.props.className || ''}`;
    const title = this.props.title || '';
    
    return (
      <div className={className}>
        <div className="module-header">
          <FontAwesome name="lock" size="2x"/>
          {title}
        </div>
        <div className="module-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}