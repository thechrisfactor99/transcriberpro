import React, { useState, useEffect, useContext } from "react"
import { API } from "aws-amplify"
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const PaymentMethodButton = (props) => {
  const stripe = props.stripe
  const elements = props.elements


  const handleSaveCard = async () => {

    const fetchSession = async () => {

    const myInit = { // OPTIONAL
        headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'}, // OPTIONAL
          };

      let response = await API.get('stripeAPI', '/card-wallet', myInit).then(function(response) {
        console.log(response)
        return response}).then(async function(responseJson) {
          console.log(responseJson)
          var clientSecret = responseJson.client_secret;

            const result = await stripe.confirmCardSetup(clientSecret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  name: 'Jenny Rosen',
                },
              }
            });


              if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
              } 
              else {
                console.log(result)
          }})
      
      }
      await fetchSession()

    }


  return ( <div><CardElement>
      </CardElement>
            <button onClick={handleSaveCard} disabled={!stripe}>
        Save
      </button></div>)
}

export default PaymentMethodButton