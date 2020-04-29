'use strict';

async function queryBasketProducts({db, basket}) {
  return db.collection('products').find({
    name: {'$in': basket.map(item => item.name)}
  }).toArray();
}

async function queryActiveOffers({db, date}) {
  return db.collection('offers').find({}).toArray();
}

module.exports = {
  queryBasketProducts,
  queryActiveOffers,
};
