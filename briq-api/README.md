# briq-developer-challenge

A developer challenge on Briq's tech stack

## Guidelines

- solve this for Node.js 10 and Postgresql 9
- clone this repo (*do not fork it*)
- solve each question in its own branch on your clone
- create a PR on your own repo for each question
- ping the Briq team when you're done
- keep it simple. [DTSTTCPW](http://lmgtfy.com/?q=dtsttcpw)

Make sure you write a solution that is clean, simple, extensible and robust.

## Question 1 (~30min)

There is a first implementation of the `User.give` method. However, it's not tested.
Write test(s) for this method. 
Also, the balance of a user cannot be negative, and a transaction that would make it go under 0 should fail. 
Please adapt the code to make it work this way.

## Question 2 (~2h)

Having users and transactions saved in the database is nice, but not very useful without any interface.
Please add a user interface that allows the following:

- List users with their username and their balance
- Add a user
- Edit a user's username and balance
- Remove a user
- Let a user give Briqs to another user
- (bonus) List transactions of a user

Keep it simple.
But make sure it works and delivers a pleasing experience for at least 100 users (you can run `npm run populate` to populate your database with random data).

## Question 3 (~1h)

We now want to compute aggregated stats on user's behaviours. 
Run `npm run populate` to populate your database with random data.
Then write the following SQL queries:

- All users with their id, username, balance, the date at which they received Briqs for the last time, the date at which they gave Briqs for the last time
- All users (including deleted ones) with their id, username, balance, the number of Briqs they received and the number of Briqs they gave.
- All users (id, username) that gave Briqs in the last 2 days, and the date at which they gave Briqs for the last time
- All users (id, username) that gave more than 5 Briqs in one transaction, and the highest number of Briqs they gave

You can compare your results to the csv files generated when you run the script. Standard SQL is preferred, but you can use pg-specific syntax if there's a real benefit.

Hope you'll have fun. Don't hesitate to ping me for any question.
