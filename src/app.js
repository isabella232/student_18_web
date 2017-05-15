import React from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'

import Home from './app/home'
import ModuleRandom from './components/module/random/module-random'

/**
 * Entry point of the application
 * External routes are used to integrate modules in an IFrame for distant website
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 * @constructor
 */
const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/external/random" component={ModuleRandom}/>
    </div>
  </BrowserRouter>
);

export default App
