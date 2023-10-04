const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');


module.exports = {
  // Get all thoughts
  async getThought(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thought)
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        {_id: req.body.userId},
        {$addToSet: {thoughts: thought._id}},
        {new: true}
      )

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a thought and remove it from the user
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such student exists' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but associated user not found',
        });
      }

      res.json({ message: 'Thought deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // POST reaction 
 async createReaction(req, res) {
  try{
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$addToSet: {reactions: req.body}},
      { runValidators: true, new: true }
    )

    if (!thought) {
      return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' })
      }
    
      res.json(thought)
  } catch (err) {
    res.status(500).json(err);
  }
 },

 // DELETE reaction
 async deleteReaction(req, res) {
  try{
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$pull: {reactions: {reactionId: req.params.reactionId}}},
      { runValidators: true, new: true }
    )

    if (!thought) {
      return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' })
      }
    
      res.json(thought)
  } catch (err) {
    res.status(500).json(err);
  }
}
};
