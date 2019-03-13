const moment = require('moment');
const faker = require('faker');
const Promise = require('bluebird');
const csv = Promise.promisifyAll(require('csv'));
const fs = Promise.promisifyAll(require('fs'));
const { user: User } = require('../models');

const generateUsers = (number) => {
  const createUsers = [];
  for (let i = 0; i < number; i++) {
    const balance = 100 + Math.trunc(Math.random() * 100);
    const username = faker.name.findName();
    createUsers.push(User.create({ username, balance }));
  }
  return Promise.all(createUsers);
};

const randomUserFrom = (users) => {
  const userIds = Object.keys(users);
  let user;

  while (user == null || user.user.balance === 0) {
    const userId = userIds[Math.trunc(Math.random() * userIds.length)];
    user = users[userId];
  }

  return user;
};

const randomUserTo = (users, userFrom) => {
  const userIds = Object.keys(users);
  let user;

  while (user == null || user.user.id === userFrom.id) {
    const userId = userIds[Math.trunc(Math.random() * userIds.length)];
    user = users[userId];
  }

  return user;
};

const createTransactions = (users, days, transactionsPerDay) => {
  const createTransactionsPromises = [];
  const day = moment();

  for (let d = 0; d < days; d++) {
    day.subtract(1, 'days');

    for (let i = 0; i < transactionsPerDay; i++) {
      const userFrom = randomUserFrom(users);
      const userTo = randomUserTo(users, userFrom.user);
      const amount = Math.min(userFrom.user.balance, 1 + Math.trunc(Math.random() * 10));

      const give = userFrom.user.give(amount, userTo.user, { createdAt: day.toDate() });
      createTransactionsPromises.push(give);

      // store meta
      userFrom.meta.highestAmount = Math.max(userFrom.meta.highestAmount, amount);
      userFrom.meta.lastGive = userFrom.meta.lastGive || day.toDate();
      userFrom.meta.totalGiven += amount;

      userTo.meta.lastReceive = userTo.meta.lastReceive || day.toDate();
      userTo.meta.totalReceived += amount;
    }
  }
  return Promise.all(createTransactionsPromises);
};

const writeCsv = async (fileName, data) => {
  const txt = await csv.stringifyAsync(data, { header: true });
  return fs.writeFileAsync(`${__dirname}/${fileName}`, txt);
};

const generateCsvs = (users) => {
  const query1 = [];
  const query2 = [];
  const query3 = [];
  const query4 = [];
  const twoDaysago = moment().subtract(2, 'days').startOf('day').toDate();

  Object.keys(users).forEach((userId) => {
    const user = users[userId];
    const { id, username, balance } = user.user;
    const {
      lastReceive, lastGive, totalReceived, totalGiven, highestAmount,
    } = user.meta;

    // export 1: All users with their id, username, balance, the date at which they
    // received Briqs for the last time, the date at which they gave Briqs for the last time
    query1.push({
      id, username, balance, lastReceive, lastGive,
    });

    // export 2: All users with their id, username, balance,
    // the number of Briqs they received and the number of Briqs they gave
    query2.push({
      id, username, balance, totalReceived, totalGiven,
    });

    // export 3: All users (id, username) that gave Briqs in the last 3 days, and the last give date
    if (lastGive > twoDaysago) {
      query3.push({ id, username, lastGive });
    }

    // export 4: All users (id, username) who gave more than 5 Briqs in one transaction,
    // and the highest number of Briqs they gave
    if (highestAmount > 5) {
      query4.push({ id, username, highestAmount });
    }
  });

  return Promise.all([
    writeCsv('export1.csv', query1),
    writeCsv('export2.csv', query2),
    writeCsv('export3.csv', query3),
    writeCsv('export4.csv', query4),
  ]);
};

async function random() {
  try {
    const newUsers = await generateUsers(100);
    const users = newUsers.reduce((us, u) => {
      // eslint-disable-next-line no-param-reassign
      us[u.id] = { user: u, meta: { totalGiven: 0, totalReceived: 0, highestAmount: 0 } };
      return us;
    }, {});
    await createTransactions(users, 30, 40);
    await generateCsvs(users);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

random();
