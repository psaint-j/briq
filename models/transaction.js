const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {

  const Transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  });

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.user, { as: 'userFrom' });
    Transaction.belongsTo(models.user, { as: 'userTo' });
  }

  return Transaction;
}
