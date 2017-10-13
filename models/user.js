const { sequelize } = require('./index');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  User.prototype.give = function (amount, userTo, options = {}) {
    const tx = _.defaults({ amount, userToId: userTo.id }, options);
    return this.createDebit(tx)
      .then(() => this.decrement({ balance: amount }))
      .then(() => userTo.increment({ balance: amount }));
  };

  User.associate = function (models) {
    User.hasMany(models.transaction, { as: 'credits', foreignKey: 'userToId' });
    User.hasMany(models.transaction, { as: 'debits', foreignKey: 'userFromId' });
  }

  return User;
}
