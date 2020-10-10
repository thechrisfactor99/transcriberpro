import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from "react-router-dom"

import {UserContextProvider} from './UserContext'

import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';

import awsconfig from './aws-exports';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HZiNWHBb1XONjtR4RcdyWInbBEx5XuIn8T46pUa4CbEivLuNLitDSWYJyiAiHvRKbAVWoFTvlZbJubRgWOuhRzW00UtzRZi0T');


Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
  	<UserContextProvider>
    <Router><Elements stripe={stripePromise}>
		<App /></Elements></Router>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
