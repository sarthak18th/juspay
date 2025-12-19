import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

// const express = require("express");

// const bodyParser = require("body-parser");
// const fetch = require("node-fetch");
// const dotenv = require("dotenv");
// const cors = require("cors");

dotenv.config();
const app = express();
app.use(bodyParser.json());
// app.use(cors({ origin: "http://localhost:3000" })); // or "*" for all origins
app.use(cors({ origin: process.env.FRONTEND })); // or "*" for all origins
let key;
let mid;
app.post("/create-session", async (req, res) => {
  console.log('req',req)
  key=req?.body?.key
  mid=req?.body?.mid
  try {
    // console.log("reqreq", req);

    // Lists of Indian first names and last names 

const REFERENCE_ID_TO_METADATA_KEY = {
  JAS_WORLDPAY_UK_1: 'metadata.WORLDPAY:gateway_reference_id',
  JAS_WORLDPAY_UK_2: 'metadata.WORLDPAY:gateway_reference_id',
  JAS_STRIPE_UK_1: 'metadata.STRIPE:gateway_reference_id',
  JKS_STRIPE_US_1: 'metadata.STRIPE:gateway_reference_id',
};


    const firstNames = [
      'Aarav', 'Aditi', 'Akshay', 'Amit', 'Ananya',
      'Arjun', 'Avani', 'Bhavya', 'Chetan', 'Devi',
      'Divya', 'Gaurav', 'Isha', 'Kiran', 'Manoj',
      'Neha', 'Preeti', 'Rajesh', 'Riya', 'Shreya',
      'Varun', 'Saurabh', 'Ajay', 'Sandip', 'Sadan',
      'Jyoti', 'Sapna', 'Prem'
    ];
    const lastNames = [
      'Agarwal', 'Bansal', 'Chopra', 'Gupta', 'Jain',
      'Kapoor', 'Mehta', 'Patel', 'Rao', 'Sharma',
      'Singh', 'Trivedi', 'Verma', 'Yadav'
    ];

    const generateRandom = () => {
      const randomFirstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName =
        lastNames[Math.floor(Math.random() * lastNames.length)];

      // return `${randomFirstName} ${randomLastName}`;
      return {
        first: randomFirstName,
        last: randomLastName,
        email: randomFirstName.toLowerCase() + "." + randomLastName.toLowerCase() + "@mail.com",
        mobile: String(Math. floor(Math. random() * (9999999999 - 1000000000 + 1)) + 1000000000) || "9876543210",
        id: randomFirstName.toLowerCase() + "_" + randomLastName.toLowerCase() + "_" + Math. floor(Math. random() * 1000),
        order_id: randomFirstName.toLowerCase() + "_" + randomLastName.toLowerCase() + "_" + Math. floor(Math. random() * 1000)
      };
    };

    // let dynamicReferenceId = {
    //   // 'metadata.STRIPE:gateway_reference_id': "TestStripe",
    //   // 'metadata.ADYEN:gateway_reference_id': "JoyalukkasECOM",
    //   //JOYALUKKAS_JEWELRY_USA
    //   //Joyalukkas_Ltd_UK
    //   //JOYALUKKAS_AUTHORIZEDOTNET

    // };

    // if (req?.body?.currency === "GBP" && req?.body?.type === "Easy Gold") {
    //   dynamicReferenceId['metadata.WORLDPAY:gateway_reference_id'] = "JOYEASYGOLDGBP";
    //   dynamicReferenceId['metadata.STRIPE:gateway_reference_id'] = "PGUKSP001";
    // }
    // else if (req?.body?.currency === "GBP" && req?.body?.type === "Advance Booking") {
    //   dynamicReferenceId['metadata.WORLDPAY:gateway_reference_id'] = "JOYRATEFIXGBP";
    //   dynamicReferenceId['metadata.STRIPE:gateway_reference_id'] = "PGUKSP001";
    // }
    // else if (req?.body?.currency === "GBP") {
    //   dynamicReferenceId['metadata.STRIPE:gateway_reference_id'] = "PGUKSP001";
    // }

    // else if (req?.body?.currency === "USD" && (req?.body?.type === "Easy Gold" || req?.body?.type === "Advance Booking" || req?.body?.type === "Ecommerce")) {
    //   dynamicReferenceId['metadata.AUTHORIZEDOTNET:gateway_reference_id'] = "JOYALUKKAS_AUTHORIZEDOTNET";
    //   dynamicReferenceId['metadata.STRIPE:gateway_reference_id'] = "PGUSSP001";
    // }
    // else if (req?.body?.currency === "USD") {
    //   dynamicReferenceId['metadata.AUTHORIZEDOTNET:gateway_reference_id'] = "JOYALUKKAS_AUTHORIZEDOTNET";
    // }

    // else if (req?.body?.currency === "AED") {
    //   dynamicReferenceId['metadata.ADYEN:gateway_reference_id'] = "JoyalukkasECOM";
    // }

    const dynamicReferenceId = {};
const referenceId = req?.body?.reference_ID;

if (referenceId && REFERENCE_ID_TO_METADATA_KEY[referenceId]) {
  dynamicReferenceId[REFERENCE_ID_TO_METADATA_KEY[referenceId]] = referenceId;
}


     
    const payload = {
      order_id: String(generateRandom()?.order_id || "order-12345"),
      amount: req?.body?.amount || "50.00",
      customer_id: generateRandom()?.id || "testing-customer-two",
      customer_email: generateRandom()?.email || "test@mail.com",
      customer_phone: generateRandom()?.mobile || "9876543210",
      payment_page_client_id: process.env.JUSPAY_CLIENT_ID,
      action: "paymentPage",
      return_url: process.env.FRONTEND,
      // return_url: "http://localhost:3000",
      // // return_url: "http://localhost:4000/payment-response",
      description: "Complete your payment",
      first_name: generateRandom()?.first || "John",
      last_name: generateRandom()?.last || "Wick",
      currency: req?.body?.currency,

      // "options.create_mandate": "REQUIRED", //OPTIONAL

      // "metadata.JUSPAY:gateway_reference_id": "JOYEASYGOLDGBP"
      // "metadata.JUSPAY:gateway_reference_id": "JOYRATEFIXGBP",
      // "metadata.WORLDPAY:gateway_reference_id":"JOYRATEFIXGBP",
      // "metadata.WORLDPAY:gateway_reference_id":"JOYEASYGOLDGBP",
      // "metadata.STRIPE:gateway_reference_id":"PGUKSP001",

      ...dynamicReferenceId,

      udf1: req?.body?.type, // upto udf10 can be sent,
      udf2: "Custom value 1" // upto udf10 can be sent,
    };

    const response = await fetch("https://sandbox.juspay.in/session", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${req?.body?.key}`,
        "x-merchantid": req?.body?.mid,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Juspay Error:", data);
      return res.status(500).json({ error: "Failed to create session", details: data });
    }

    // Juspay responds with payment_session_id and redirect URLs
    res.json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/payment-response", async (req, res) => {

  try {
    console.log("payment-response", req);

    // const data = await response.json();
    // if (!response.ok) {
    //   console.error("Juspay Error:", data);
    //   return res.status(500).json({ error: "Failed to create session", details: data });
    // }

    // // Juspay responds with payment_session_id and redirect URLs
    // res.json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/order-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Call Juspay sandbox API with correct headers
    const response = await fetch(`https://sandbox.juspay.in/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${key}`,
        "x-merchantid": mid,
        "Content-Type": "application/json"
      }
      // headers: {
      //   "Authorization": 'Basic QzEzOEEyNDRGN0E0QjFFOUI0MDQyRjNFMDQ0NThEOg==',
      //   "x-merchantid": 'joyalukkas',
      //   "Content-Type": "application/json"
      // }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Juspay order-status error:", response.status, data);
      return res.status(500).json({ error: "Failed to fetch order status", details: data });
    }

    // Return order status to frontend
    res.json(data);

  } catch (err) {
    console.error("⚠️ Order status error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});
app.listen(4000, () => console.log("✅ Backend running on port 4000"));
