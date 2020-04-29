'use strict';

const MongoClient = require('mongodb').MongoClient;

(async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test-a');  

  await db.collection('products').insertMany([
    {
      id: 1,
      name: 'Apples',
      price: 1
    },
    {
      id: 2,
      name: 'Soup',
      price: 0.65
    },
    {
      id: 3,
      name: 'Bread',
      price: 0.8
    },
    {
      id: 4,
      name: 'Milk',
      price: 1.3
    },
  ]);

  await db.collection('offers').insertMany([
    {
      type: 'discount',
      details: {
          productId: 1,
          discount: 0.1
      },
      startDate: '',
      endDate: ''
    },
    {
      type: 'package',
      details: [
          {
              productId: 2,
              requiredAmount: 2,
          },
          {
              productId: 3,
              discount: 0.5,
          },
      ],
      startDate: '',
      endDate: ''
    }
  ]);  

  client.close();
  process.exit(0);

})();
 
