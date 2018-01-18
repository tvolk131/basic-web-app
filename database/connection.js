const Sequelize = require('sequelize');
console.log(JSON.parse(process.env.DB_LOGGING));
const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: JSON.parse(process.env.DB_LOGGING)
};
if (!(config.username && config.password && config.database && config.host && config.dialect && config.logging !== undefined)) {
  throw new Error('Missing database config in .env file');
}
let connection = new Sequelize(config.database, config.username, config.password, config);
connection.clear = () => {
  return connection.sync({force: true});
};

module.exports = connection;