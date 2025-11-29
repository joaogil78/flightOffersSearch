export const runtime = "edge";

import Amadeus from './node_modules/amadeus/lib/amadeus.js';
import express from 'express';
import dotenv from 'dotenv';

/* const Amadeus = require('amadeus');
const express = require('express');
const dotenv  = require('dotenv'); */

dotenv.config();
const app = express();

//var http = require('http').createServer(app);

const amadeus = new Amadeus({
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
});

app.use(express.static('public'));

/* app.get('/', (req, res) => {
  res.send('Hello World!')
}); */

// AUTOCOMPLETE
app.get('/api/autocomplete', async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    response.json(data);
  } catch(error) {
    console.error(error.response);
    response.json([]);
  }
});

app.get('/api/search', async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: query.origin,
      destinationLocationCode: query.destination,
      departureDate: query.departureDate,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
      travelClass: query.travelClass,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    });
    response.json(data);

  } catch(error) {
    console.error('MY ERROR: ', error);
    response.json([]);
  }
});

/* app.get(`/citysearch`, async (req, res) => {
  console.log(req.query);
  var keywords = req.query.keyword;
  const response = await amadeus.referenceData.locations
    .get({
      keyword: keywords,
      subType: "CITY,AIRPORT",
    })
    .catch((x) => console.log(x));
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
}); */

app.listen(process.env.PORT, () => console.log('Server start...'));