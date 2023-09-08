const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const sequelize = require("./sequelize");
const Employee = require("./employee");
const Review = require("./review");

const ReviewAssignment = sequelize.define('ReviewAssignment', {
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Employees',
        key: 'id',
      },
    },
    revieweeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Employees',
        key: 'id',
      },
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reviews',
        key: 'id',
      },
    },
  });

ReviewAssignment.belongsTo(Employee, { foreignKey: 'reviewerId', as: 'reviewer' });
ReviewAssignment.belongsTo(Employee, { foreignKey: 'revieweeId', as: 'reviewee' });
ReviewAssignment.belongsTo(Review, { foreignKey: 'reviewId' });

module.exports = ReviewAssignment;