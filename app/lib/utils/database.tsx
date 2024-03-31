var mongoose = require('mongoose');

const username = 'spencerdale'
const password = 'pPsAIQXN2m2YfxGr'
const server = 'tripwell-dev.csz8mj8.mongodb.net';
const database = 'tripwell';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(`mongodb+srv://${username}:${password}@${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((_: any) => {
        console.error('Database connection error');
      });
  }
}

module.exports = new Database();