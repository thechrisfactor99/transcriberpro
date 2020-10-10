import React, {useState, useEffect, useContext, useRef}  from "react";
import { Link } from "react-router-dom";

import Input from './components/Input'
import Form from './components/Form'
import FormCol from './components/FormCol'


import CheckoutButton from './CheckoutButton'
import PaymentMethodButton from './PaymentMethodButton'

import { loadStripe } from "@stripe/stripe-js"
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const Settings = (props) => {

  const stripePromise = loadStripe("pk_test_51HZiNWHBb1XONjtR4RcdyWInbBEx5XuIn8T46pUa4CbEivLuNLitDSWYJyiAiHvRKbAVWoFTvlZbJubRgWOuhRzW00UtzRZi0T")
  const elements = useElements()
  const stripe = useStripe(stripePromise)

  const [addingFunds, setAddFunds] = useState(true)

  console.log(props)

	return(
		<div className="w-full mx-6">
			<Link to="/" className="text-blue-500 hover:text-blue-700 hover:underline">{"<< Back"}</Link>
			<p>Settings</p>
      <Form title={"Account"} hideButton={true}>
        <FormCol>
          <Input label={"Email"} disabled={true} value={props.stateDict.email} name={"email"}  />
          <Input label={"Password"} disabled={true} value={"abcdefghijklmnop"} name={"password"}  />
          <div className="px-12 mt-2 mb-4 text-right"><Link to="settings/password" className="mr-4 text-blue-700">Change Password</Link></div>         
        </FormCol>
      </Form>
      <h1>Buy Additional Hours:</h1>
      {addingFunds ? <CheckoutButton stripe={stripe} elements={elements} /> : <button onClick={() => setAddFunds(true)}>Add Hours</button>}
      <h1>Payment Details</h1>
      {!addingFunds ? <PaymentMethodButton stripe={stripe} elements={elements} /> : <button onClick={() => setAddFunds(false)}>Add Hours</button>}
		</div>
		)
	}

export default Settings