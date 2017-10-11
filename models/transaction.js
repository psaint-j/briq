const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {

  const Transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.user, { as: 'userFrom' });
    Transaction.belongsTo(models.user, { as: 'userTo' });
  }

  return Transaction;
}
