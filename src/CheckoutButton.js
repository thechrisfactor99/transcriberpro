import React from "react"
import { API } from "aws-amplify"
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const CheckoutButton = (props) => {
  const stripe = props.stripe
  const elements = props.elements

  const handlePayment = async () => {
    const fetchSession = async () => {

    const myInit = { // OPTIONAL
        headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'}, // OPTIONAL
          };

      let response = await API.get('stripeAPI', '/checkout', myInit).then(function(response) {
        console.log(response)
        return response}).then(async function(responseJson) {
        console.log(responseJson)
        var clientSecret = responseJson.client_secret;
        const result = await stripe.confirmCardPayment(clientSecret, {
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
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status === 'succeeded') {
                console.log('successful payment!')
                console.log(result)
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
              }
            }        // Call stripe.confirmCardPayment() with the client secret.
      })
      
      }
      await fetchSession()

    }

  return ( <div><CardElement>
      </CardElement>
            <button onClick={handlePayment} disabled={!stripe}>
        Pay
      </button></div>)
}

export default CheckoutButton