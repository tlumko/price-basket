'use strict';

const offerService = require('./offer.service');

async function priceBasket({products, activeOffers}) {
  const subTotal = calculateSubTotal(products);

  const offers = activeOffers.filter(offer => offerService.isFullfilled({offer, products}));

  const discountDetails = offerService.getDiscountDetails({offers, products});
  const discount = offerService.calculateDiscount(discountDetails);
  const discountDescription = offerService.generateDescription(discountDetails) || '(no offers available)';
  
  let total = subTotal;
  if (discount) {
    total = total - discount;
  }

  return {
    subTotal: subTotal,
    discountDescription,
    total: total,
  };
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