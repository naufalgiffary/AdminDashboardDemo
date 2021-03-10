import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Components/Login'
import Register from './Components/Register'
import Resi from './Components/Resi'
import User from './Components/User'
import Uploadresi from './Components/Uploadresi'
import { Switch, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <div className="thebody">
        <Switch >
          <Route exact path='/' component={Resi} />
          <Route exact path='/user' component={User} />
          <Route exact path='/upload' component={Uploadresi} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Switch>
      </div >
    </>
  );
}

export default App;