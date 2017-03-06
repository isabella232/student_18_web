import React from 'react'
import {Container, Row, Col} from 'reactstrap'

import ServersStatus from './components/servers-status/servers-status'

import './app.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container fluid={true}>
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
