import React from 'react'
import FontAwesome from 'react-fontawesome'

import './loading-spinner.css'

export default class LoadingSpinner extends React.Component {
  render() {
    return (
      <div className="loading-spinner">
        <FontAwesome name="circle-o-notch" size="3x" spin/>
      </div>
    );
  }
}