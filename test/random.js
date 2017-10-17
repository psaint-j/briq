const { user: User, transaction: Transaction } = require('../models');
const moment = require('moment')
const Moniker = require('moniker');
const Promise = require('bluebird');
const csv = Promise.promisifyAll(require('csv'));
const fs = Promise.promisifyAll(require('fs'));

const generateUsers = (number) => {
  const createUsers = [];
  for (let i = 0; i < number; i++) {
    const balance = 100 + Math.trunc(Math.random() * 100);
    const username = Moniker.choose();
    createUsers.push(User.create({ username, balance }));
  }
  return Promise.all(createUsers);
}

randomUserFrom = (users) => {
  const userIds = Object.keys(users);
  let user;

  while (user == null || user.user.balance == 0) {
    const userId = userIds[Math.trunc(Math.random() * userIds.length)];
    user = users[userId];
  }

  return user;
};


randomUserTo = (users, userFrom) => {
  const userIds = Object.keys(users);
  let user;

  while (user == null || user.user.id == userFrom.id) {
    const userId = userIds[Math.trunc(Math.random() * userIds.length)];
    user = users[userId];
  }

  return user;
};

const createTransactions = (users, days, transactionsPerDay) => {

  const createTransactions = [];
  const day = moment();

  for (let d = 0; d < days; d++) {
    day.subtract(1, 'days');

    for (let i = 0; i < transactionsPerDay; i++) {
      const userFrom = randomUserFrom(users);
      const userTo = randomUserTo(users, userFrom.user);
      const amount = Math.min(userFrom.user.balance, 1 + Math.trunc(Math.random() * 10));

      createTransactions.push(userFrom.user.give(amount, userTo.user, { createdAt: day.toDate() }));

      // store meta
      userFrom.meta.highestAmount = Math.max(userFrom.meta.highestAmount, amount);
      userFrom.meta.lastGive = userFrom.meta.lastGive || day.toDate();
      userFrom.meta.totalGiven += amount;

      userTo.meta.lastReceive = userTo.meta.lastReceive || day.toDate();
      userTo.meta.totalReceived += amount;
    }
  }
  return Promise.all(createTransactions);
}

const writeCsv = (fileName, data) => {
  return csv.stringifyAsync(data, { header: true })
    .then(txt => fs.writeFileAsync(__dirname + '/' + fileName, txt));
}

const generateCsvs = (users) => {

  // export 1: All users with their id, username, balance, the date at which they
  // received Briqs for the last time, the date at which they gave Briqs for the last time
  const export1 = writeCsv('export1.csv', Object.keys(users).reduce((result, userId) => {
    const user = users[userId];
    const { id, username, balance } = user.user;
    const { lastReceive, lastGive } = user.meta;
    result.push({ id, username, balance, lastReceive, lastGive });
    return result;
  }, []));

  // export 2: All users (including deleted ones) with their id, username, balance,
  // the number of Briqs they received and the number of Briqs they gave
  const export2 = writeCsv('export2.csv', Object.keys(users).reduce((result, userId) => {
    const user = users[userId];
    const { id, username, balance } = user.user;
    const { totalReceived, totalGiven } = user.meta;
    result.push({ id, username, balance, totalReceived, totalGiven });
    return result;
  }, []));

  // export 3: All users (id, username) that gave Briqs in the last 3 days, and the last give date
  const twoDaysago = moment().subtract(2, 'days').startOf('day').toDate();
  const export3 = writeCsv('export3.csv', Object.keys(users).reduce((result, userId) => {
    const user = users[userId];
    const { id, username } = user.user;
    const { lastReceive } = user.meta;
    if (lastReceive > twoDaysago){
      result.push({ id, username, lastReceive });
    }
    return result;
  }, []));

  // export 4: All users (id, username) who gave more than 5 Briqs in one transaction, 
  // and the highest number of Briqs they gave
  const export4 = writeCsv('export4.csv', Object.keys(users).reduce((result, userId) => {
    const user = users[userId];
    const { id, username } = user.user;
    const { highestAmount } = user.meta;
    if (highestAmount > 5){
      result.push({ id, username, highestAmount });
    }
    return result;
  }, []));

  return Promise.all([
    export1,
    export2,
    export3,
    export4
  ]);
}

let users;
generateUsers(100)
  .then(newUsers => {
    users = newUsers.reduce((us, u) => {
      us[u.id] = { user: u, meta: { totalGiven: 0, totalReceived: 0, highestAmount: 0 } };
      return us;
    }, {});
    return createTransactions(users, 30, 40);
  })
  .then(() => generateCsvs(users))
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });