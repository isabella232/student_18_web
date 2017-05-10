import React, {PropTypes as T} from 'react'
import FontAwesome from 'react-fontawesome'

import './module.css'

/**
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 *
 * Base component of a module. You can define the title of the module and its icon using the name
 * of an icon in http://fontawesome.io/icons/
 */
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