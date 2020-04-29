'use strict';

const offerService = require('./offer-service');
const { toCents, formatPrice } = require('./utils');

async function priceBasket({db, date, basket}) {
  const products = await queryProducts({db, basket});
  const activeOffers = await queryActiveOffers({db, date});

  const offers = activeOffers.filter(offer => offerService.isFullfilled({offer, products}));

  const subTotal = calculateSubTotal(products);
  const discount = offerService.calculateDiscount({offers, products});
  const discountDescription = offerService.generateDescription({offers, products}) || '(no offers available)';
  let total = subTotal;
  if (discount) {
    total = total - discount;
  }

  return {
    subTotal: formatPrice(subTotal),
    discountDescription,
    total: formatPrice(total)
  };
}

async function queryProducts({db, basket}) {
  let products = await db.collection('products').find({
    name: {'$in': basket.map(item => item.name)}
  }).toArray();

  products = products.map(product => ({
    ...product,
    price: toCents(product.price),
    amount: basket.find(item => item.name === product.name).amount,
  }));

  return products;
}

async function queryActiveOffers({db, date}) {
  return db.collection('offers').find({}).toArray();
}

function calculateSubTotal(products) {
  return products.reduce((sum, product) => {
    sum += product.price * product.amount;
    return sum;
  }, 0);
}

module.exports = {
  priceBasket
};