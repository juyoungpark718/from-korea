const _ = require("fxjs/Strict");
const fetch = require("node-fetch");
const paymentModel = require("../models/payment");

const API = process.env.PAYPAL_API;
const clientID = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;

const encodeBase64 = (str) => Buffer.from(str).toString("base64");

const getAccessTokenPayPal = () => 
  fetch(`${API}/v1/oauth2/token`, {
    method:"POST",
    headers:{
      "Content-type": 'application/x-www-form-urlencoded',      
      Authorization: `Basic ${encodeBase64(clientID)}:${encodeBase64(secret)}`
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  }).then(res => res.json());

const createPaypalOrder = ({ intent, purchase_units }) => accessToken => 
  fetch(`${API}/v2/checkout/orders`, {
    method: "POST",
    headers:{
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ intent, purchase_units })
  }).then(res => res.json());

const createPayment = ({ userId, amount, orderId }) => paymentModel.createPayment({ userId, orderId, amount });

const findPaymentByOrderId = (orderId) => paymentModel.findPaymentByOrderId(orderId);

const findPaymentsWithProductsByUserId = (userId) => paymentModel.findPaymentsWithProductsByUserId(userId);



module.exports = {
  getAccessTokenPayPal,
  createPaypalOrder,
  createPayment,
  findPaymentByOrderId,
  findPaymentsWithProductsByUserId
}