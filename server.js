'use strict';


const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const joi = require('joi');
const bodyParser = require('body-parser');

const { priceBasket } = require('./index');

const app = express();
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const bodySchema = joi.object().keys({
    date: joi.string(),
    basket: joi.array().items(joi.object().keys({
      name: joi.string().required(),
      amount: joi.number().required(),
    })).required()
  }).required();

  const {error} = joi.validate(req.body, bodySchema);

  if (error) {
    res.status(400);
    res.send(error.message);
    return;
  }

  const {subTotal, discountDescription, total} = await priceBasket({
    db: app.db,
    date: req.body.date,
    basket: req.body.basket
  });

  console.log({subTotal, discountDescription, total});

  res.json({subTotal, discountDescription, total});
});

MongoClient.connect('mongodb://localhost:27017')
  .then(client => {
    const db = client.db('test-a');  
    app.db = db;

    app.listen(3000, () => {
      console.log('server started')
    });
  });

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
