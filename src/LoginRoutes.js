import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from './AppliedRoute.js'


import Login from './Login'
import Signup from './Signup'

export default function Routes({appProps}) {
  return (
    <Switch>
      <AppliedRoute path="/login" exact component={Login} appProps={appProps}/>
      <AppliedRoute path="/signup" exact component={Signup} appProps={appProps}/>
      <AppliedRoute path="/" component={Login} appProps={appProps}/>
    </Switch>
  );
}