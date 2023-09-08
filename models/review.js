const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const sequelize = require("./sequelize");


const Review = sequelize.define('Review', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Completed'),
      defaultValue: 'Pending',
    },
  });

module.exports = Review;