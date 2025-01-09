var mongoose = require('mongoose');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const server = process.env.DB_SERVER;
const database = process.env.DB_NAME;

const DB_READY = 1

export async function connectDb() {
  if (isConnected()) { return }

  await mongoose
    .connect(`mongodb+srv://${username}:${password}@${server}/${database}`)
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((error: any) => {
      console.error('Database connection error: %s', error);
    });
};

function isConnected() : boolean {
  return mongoose.connection.readyState == DB_READY
}