'use strict';

const toCents = price => price*100;

const formatPrice = price => {
  if (price < 100) {
    return `${price}c`
  }

  return `$${price/100}`;
}

module.exports = {
  toCents,
  formatPrice,
};