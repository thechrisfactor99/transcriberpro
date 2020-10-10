import React from "react";
import { Route } from "react-router-dom";

export default function AppliedRoute({ component: C, appProps, username, ...rest }) {
  return (
    <Route {...rest} render={props => <C className="h-full w-full border-2 border-green-400" {...props} {...appProps} {...username} />} />
  );
}