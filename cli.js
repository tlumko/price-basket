'use strict';

const MongoClient = require('mongodb').MongoClient;
const { priceBasket } = require('./index');

(async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test-a');  

  const {date, basket} = parseArgs();

  const {subTotal, discountDescription, total} = await priceBasket({db, date, basket});

  console.log(`Subtotal: $${subTotal}`);
  console.log(discountDescription);
  console.log(`Total $${total}`);

  client.close();
  process.exit(0);
})();

function parseArgs() {
  const args = process.argv.slice(2);
  
  const date = args[0];
  let products = {};

  for (let i = 1; i < args.length; i++) {
    let count = 1;
    let name = args[i];

    if (name === '--count') {
      name = args[i-1];
      i++;
      count = parseInt(args[i]) - 1;
    }

    if (!products[name]) {
      products[name] = 0;
    }

    products[name] += count;
  }

  const basket = Object.entries(products).map(([name, amount]) => ({ name, amount }));

  return {date, basket};
}

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});