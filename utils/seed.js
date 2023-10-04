const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

const users = [
  {
    username: 'riley',
    email: 'riley@rileymail.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'darwin',
    email: 'darwin@darwinmail.com',
    thoughts: [],
    friends: [],
  },
];


connection.once('open', async () => {
    console.log('connected');

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
      await connection.dropCollection('users');
    }
    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection('thoughts');
    }

    await User.collection.insertMany(users)

    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
})