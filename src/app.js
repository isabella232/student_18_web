import React from 'react'
import {Container, Row, Col} from 'reactstrap'

import ServersStatus from './components/servers-status/servers-status'
import ModuleSign from './components/module/signature/module-sign'
import ModuleVerify from './components/module/signature/module-verify'
import ModuleSkipChain from './components/module/skipchain/module-skipchain'
import ModuleHTML from './components/module/html/module-html'
import ModuleRandom from './components/module/random/module-random'

import './app.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container fluid={true}>
          <Row noGutters>
            <Col xs="auto">
              <ModuleSign/>
            </Col>
            <Col xs="auto">
              <ModuleVerify/>
            </Col>
            <Col>
              <ModuleSkipChain/>
            </Col>
            <Col>
              <ModuleHTML/>
            </Col>
          </Row>
          <Row noGutters>
            <Col xs="auto">
              <ModuleRandom/>
            </Col>
          </Row>
          <Row>
            <Col>
              <ServersStatus/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
