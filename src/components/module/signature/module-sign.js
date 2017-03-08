import React from 'react'

import Module from '../module'
import FileDropArea from './drop-file-area'

export default class BlockSign extends React.Component {
  render() {
    return (
      <Module className="module-sign" title="Sign a file">
        <FileDropArea/>
      </Module>
    );
  }
}