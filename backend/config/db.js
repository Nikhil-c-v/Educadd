const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sqliteStoragePath = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'educadd.sqlite');
const sqliteDir = path.dirname(sqliteStoragePath);
if (!fs.existsSync(sqliteDir)) {
  fs.mkdirSync(sqliteDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: sqliteStoragePath,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`SQLite Connected: ${sqliteStoragePath}`);
    await sequelize.sync();
    console.log('Database synchronized');
    return sequelize;
  } catch (error) {
    console.error(`Error connecting to SQLite: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
