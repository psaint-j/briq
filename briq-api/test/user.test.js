const User = require('../models').user;

test('A user has a default balance of 0', () => {
  const user = User.build();
  expect(user.balance).toEqual(0);
});
