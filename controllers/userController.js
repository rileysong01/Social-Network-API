const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // Get all users
  async getUser(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Add friend
  async addFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId)
      const friend = await User.findById(req.params.friendId)

      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }
      if (user.friends.includes(req.params.friendId)) {
        return res.status(400).json({ message: 'Friend already added' });
      }

      user.friends.push(req.params.friendId)
      await user.save();
      res.json({ message: `${user} is now friends with ${friend}` })

    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!user.friends.includes(req.params.friendId)) {
        return res.status(400).json({ message: 'Friend not found in user\'s friends list' });
      }

      user.friends = user.friends.filter(friend => friend.toString() !== req.params.friendId)
      await user.save();

      res.json({ message: 'Friend deleted successfully' });

    } catch (err) {
      res.status(500).json(err);
    }
  }
};


