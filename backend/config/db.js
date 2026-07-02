const { Sequelize } = require('sequelize');

const FALLBACK_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/educadd';
const databaseUrl = process.env.DATABASE_URL || FALLBACK_DATABASE_URL;
const shouldUseSsl =
  process.env.DB_SSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  /render\.com/i.test(databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: shouldUseSsl ? { require: true, rejectUnauthorized: false } : false,
  },
  logging: false,
});

let connectPromise = null;

const connectDB = async () => {
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    if (process.env.DB_SYNC !== 'false') {
      await sequelize.sync();
      console.log('Database synchronized');
    }

    return sequelize;
  })().catch((error) => {
    connectPromise = null;
    throw error;
  });

  return connectPromise;
};

module.exports = { sequelize, connectDB };
