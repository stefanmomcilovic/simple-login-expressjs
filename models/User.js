const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../database/dbConnect");

const User = sequelize.define("users", {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
            notEmpty: true,
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255],
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255],
            notEmpty: true,
        }
    },
}, {
    timestamps: true,
});

module.exports = {
    User
};