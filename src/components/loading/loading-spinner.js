import React from 'react'
import FontAwesome from 'react-fontawesome'

import './loading-spinner.css'

/**
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 *
 * Display a spinning circle
 */
export default class LoadingSpinner extends React.Component {
  render() {
    return (
      <div className="loading-spinner">
        <FontAwesome name="circle-o-notch" size="3x" spin/>
      </div>
    );
  }
}