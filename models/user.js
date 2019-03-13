module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  User.prototype.give = async function give(amount, userTo, options = {}) {
    const tx = {
      amount,
      userToId: userTo.id,
      ...options,
    };
    await this.createDebit(tx);
    await this.decrement({ balance: amount });
    await userTo.increment({ balance: amount });
  };

  User.associate = function associate(models) {
    User.hasMany(models.transaction, { as: 'credits', foreignKey: 'userToId' });
    User.hasMany(models.transaction, { as: 'debits', foreignKey: 'userFromId' });
  };

  return User;
};
