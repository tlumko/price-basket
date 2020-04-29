'use strict';

const { formatPrice, toCents } = require('./utils');
const { queryActiveOffers, queryBasketProducts } = require('./services/query.service');
const basketService = require('./services/basket.service');

async function priceBasket({db, date, basket}) {  
  const activeOffers = await queryActiveOffers({db, date});
  const basketProducts = await queryBasketProducts({db, basket});

  const products = prepareBasket(basket, basketProducts);

  const {subTotal, discountDescription, total} = await basketService.priceBasket({products, activeOffers});

  return {
    subTotal: formatPrice(subTotal),
    discountDescription,
    total: formatPrice(total),
  };
}

function prepareBasket(basket, products) {
  return products.map(product => ({
    ...product,
    price: toCents(product.price),
    amount: basket.find(item => item.name === product.name).amount,
  }));
}

module.exports = {
  priceBasket,
};