const Sequelize = require('sequelize');

const sequelize = new Sequelize('review', 'superanmol1', '123', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
  });

module.exports = sequelize;