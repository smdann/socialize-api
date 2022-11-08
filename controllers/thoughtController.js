const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((allThoughts) => res.json(allThoughts))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((singleThought) =>
      !singleThought
        ? res.status(404).json({ message: 'Sorry, no thought returned with that ID!'})
        : res.json(singleThought)
    )
    .catch((err) => res.status(500).json(err));
  },
  // CREATE a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        //console.log(newThought)
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )})
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  },
  // UPDATE a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body }
    ) 
      .then((updateThought) => 
        !updateThought
        ? res.status(404).json({ message: 'Sorry, no thought returned with that ID!'})
        : res.json(updateThought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((deleteThought) => 
        !deleteThought
          ? res.status(404).json({ message: 'Sorry, no thought returned with that ID!'})
          : res.json(deleteThought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // CREATE a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true },
    ) 
      .then((createReaction) => 
        !createReaction
          ? res.status(404).json({ message: 'Sorry, a thought with that ID does not exist!'})
          : res.json(createReaction)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    ) 
      .then((deleteReaction) => 
        !deleteReaction
          ? res.status(404).json({ message: 'Sorry, no reaction returned with that ID!'})
          : res.json({ message: 'The reaction has been deleted.'})
      )
      .catch((err) => res.status(500).json(err));
  },
};