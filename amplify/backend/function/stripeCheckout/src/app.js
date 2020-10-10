/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


console.log("printing stripe key")
console.log(process.env.STRIPE_SECRET_KEY)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get('/checkout', async (req, res) => {
  console.log(req)
  console.log(res)

    const paymentMethods = await stripe.paymentMethods.list({
      customer: 'cus_IANKSKQY17Bhvg',
      type: 'card',
    });
    console.log(paymentMethods)


  const customer = await stripe.customers.create();
  console.log(customer)
  const intent =  await stripe.setupIntents.create({
    customer: customer.id,
  });
  console.log(intent)
  res.json({paymentMethods: paymentMethods, customer: customer.id, client_secret: intent.client_secret });
});


/*app.get('/checkout', async (req, res) => {
  console.log(req)
  console.log(res)
  const intent = await stripe.paymentIntents.create({
  amount: 51,
  currency: 'usd',
}) // ... Fetch or create the PaymentIntent
console.log(intent)
  res.json({client_secret: intent.client_secret});
  console.log(res)
});*/



/*app.post('/checkout', async function(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId, // The priceId of the product being purchased, retrievable from the Stripe dashboard
          quantity: req.body.quantity,
        },
      ],
      mode: 'payment',
      client_reference_id: req.body.client_reference_id,
      success_url:
        'https://example.com/success?session_id={CHECKOUT_SESSION_ID}', // The URL the customer will be directed to after the payment or subscription creation is successful.
      cancel_url: 'https://example.com/cancel', // The URL the customer will be directed to if they decide to cancel payment and return to your website.
    })
    console.log("printing stripe session")
    console.log(session)
    res.json(session)
  } catch (err) {
    console.log("printing error")
    console.log(err)
    console.log(stripe)
    res.json(err)
  }
})*/

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

