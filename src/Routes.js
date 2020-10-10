import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from './AppliedRoute.js'
import Signup from './Signup'
import Home from './Home'
import Transcription from './Transcription'
import Settings from './Settings'

import NewPassword from './NewPassword'

export default function Routes({appProps}) {
  return (
    <Switch>
      <AppliedRoute path="/signup" exact component={Signup} appProps={appProps}/>
      <AppliedRoute path="/transcription/:transcriptionId" exact component={Transcription} appProps={appProps}/>
      <AppliedRoute path="/settings/password" exact component={NewPassword} appProps={appProps}/>
      <AppliedRoute path="/settings" exact component={Settings} appProps={appProps}/>

      <AppliedRoute path="/" exact component={Home} appProps={appProps}/>

    </Switch>
  );
}