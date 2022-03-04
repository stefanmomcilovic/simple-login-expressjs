const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodejs_test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;