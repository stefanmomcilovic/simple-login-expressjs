const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lukama5_nodejs_simplelogin_test', 'lukama5_simpleloginuser', 'secure253.inmotionhosting.com', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
