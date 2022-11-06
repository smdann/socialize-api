const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

module.exports = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((allThoughts) => res.json(allThoughts))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.userId })
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
      .then((newThought) => {
        console.log(newThought)
        return User.findOneAndUpdate(
          {_id: req.body.userId},
          {$push:{thoughts: newThought._id}},
          {new: true}
        )})
      .then(
        (data) =>{

          res.json(data)
        }
      )
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
      { $addToSet: { reactions: req.body } }
    ) 
      .then((createReaction) => 
        !createReaction
          ? res.status(404).json({ message: 'Sorry, no reaction returned with that ID!'})
          : res.json(createReaction)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } }
    ) 
      .then((deleteReaction) => 
        !deleteReaction
          ? res.status(404).json({ message: 'Sorry, no reaction returned with that ID!'})
          : res.json(deleteReaction)
      )
      .catch((err) => res.status(500).json(err));
  },
};