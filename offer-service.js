'use strict';

const { formatPrice } = require('./utils');

const generateDescription = (name, discount, discountSize) => `${name} ${discount*100}% off: -${formatPrice(discountSize)}`;

const findById = (products, id) => products.find(product => product.id === id);

const offerTypes = {
  discount: {
      isFullfilled:  ({offer, products}) => {
        return products.some(product => product.id === offer.details.productId)
      },
      calculateDiscount: ({offer, products}) => {
          const product = findById(products, offer.details.productId);
          return product.amount * product.price * offer.details.discount;
      },
      generateDescription: ({offer, products}) => {
        const product = findById(products, offer.details.productId);
        const discountSize = product.amount * product.price * offer.details.discount;
        return generateDescription(product.name, offer.details.discount, discountSize);
      },
  },
  package: {
      isFullfilled:  ({offer, products}) => {
        return offer.details.every(offerDetail => {
          const product = findById(products, offerDetail.productId);

          if (!product) {
            return false;
          }

          const requiredAmount = offerDetail.requiredAmount || 1;
          return product.amount >= requiredAmount;
        })
      },
      calculateDiscount: ({offer, products}) => {
        const detailsWithDiscount = offer.details.filter(detail => detail.discount);
        return detailsWithDiscount.reduce((sum, detail) => {                
          const product = findById(products, detail.productId);
          sum += product.price * detail.discount;
          return sum;
        }, 0)   
      },
      generateDescription: ({offer, products}) => {
        const detailsWithDiscount = offer.details.filter(detail => detail.discount);
        return detailsWithDiscount.map(detail => {
          const product = findById(products, detail.productId);
          const discountSize = product.price * detail.discount;
          return generateDescription(product.name, detail.discount, discountSize);
        })
      },
  }
};

const offerService = {
  isFullfilled: ({offer, products}) => offerTypes[offer.type].isFullfilled({offer, products}),
  generateDescription: ({offers, products}) => {
    return offers.map(offer => {
      return offerTypes[offer.type].generateDescription({offer, products})
    }).flat().join('\n');
  },
  calculateDiscount: ({offers, products}) => {
    return offers.reduce((sum, offer) => {
      sum += offerTypes[offer.type].calculateDiscount({offer, products});
      return sum;
    }, 0);
  }
};

module.exports = offerService;