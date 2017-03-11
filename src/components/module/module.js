import React, {PropTypes as T} from 'react'
import FontAwesome from 'react-fontawesome'

import './module.css'

export default class Module extends React.Component {
  
  static propTypes = {
    className: T.string,
    title: T.string,
    icon: T.string
  };
  
  render() {
    const {icon, title} = this.props;
    const className = `module ${this.props.className || ''}`;
    
    return (
      <div className={className}>
        <div className="module-header">
          <FontAwesome name={icon || ''} size="2x"/>
          {title || 'Module'}
        </div>
        <div className="module-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}