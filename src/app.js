import React from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'

import Home from './app/home'
import ModuleRandom from './components/module/random/module-random'

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/external/random" component={ModuleRandom}/>
    </div>
  </BrowserRouter>
);

export default App
