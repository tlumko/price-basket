1. Start a `mongod` process
2. Install project dependencies `npm install`
3. Fill DB with data: `npm run seed`
4. Start API server `npm start`

To price a basket make a `GET` request to `localhost:3000` with the body: 
{
  "basket":[
    {"name": "Apples", "amount": 2},
    {"name": "Soup", "amount": 5},
    {"name": "Bread", "amount": 2}
  ],
  "date": "1588172702975"
}

Alternatively you can run cli command:
`npm run priceBasket -- 1588172702975 Bread --count 2 Soup --count 4`