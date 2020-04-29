'use strict';

const { formatPrice } = require('../utils');

const generateDescription = (name, discount, discountSize) => `${name} ${discount*100}% off: -${formatPrice(discountSize)}`;

const findById = (products, id) => products.find(product => product.id === id);

const offerTypes = {
  discount: {
      isFullfilled:  ({offer, products}) => {
        return products.some(product => product.id === offer.details.productId)
      },
      getDiscountDetails: ({offer, products}) => {
        const product = findById(products, offer.details.productId);
        const discountSize = product.price * offer.details.discount * product.amount;
        return {
          product,
          discountSize,
          discount: offer.details.discount,
        }
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
      getDiscountDetails: ({offer, products}) => {
        const packagesCount = Math.min(...offer.details.map(offerDetail => {
          const product = findById(products, offerDetail.productId);
          const requiredAmount = offerDetail.requiredAmount || 1;
          return Math.floor(product.amount / requiredAmount);          
        }));

        const detailsWithDiscount = offer.details.filter(detail => detail.discount);

        return detailsWithDiscount.map(detail => {
          const product = findById(products, detail.productId);
          const discountSize = product.price * detail.discount * packagesCount;
          return {
            product,
            discountSize,
            discount: detail.discount,
          }
        })
      },
  }
};

const offerService = {
  isFullfilled: ({offer, products}) => offerTypes[offer.type].isFullfilled({offer, products}),
  getDiscountDetails: ({offers, products}) => {
    return offers.map(offer => {
      return offerTypes[offer.type].getDiscountDetails({offer, products});
    }).flat();
  },
  calculateDiscount: (discountDetails) => {
    return discountDetails.reduce((sum, detail) => {
      sum += detail.discountSize;
      return sum;
    }, 0);
  },
  generateDescription: (discountDetails) => {
    return discountDetails.map(detail => {
      return generateDescription(detail.product.name, detail.discount, detail.discountSize);
    }).flat().join(',\n ');
  },
};

module.exports = offerService;