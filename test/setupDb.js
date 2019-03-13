#!/bin/node
const { sequelize } = require('../models');

const setupDb = async () => {
  await sequelize.sync({ force: true });
  process.exit(0);
};

setupDb();
