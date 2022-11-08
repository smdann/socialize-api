const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // GET all of the users
  getAllUsers(req, res) {
    User.find().populate({path: 'thoughts'})
      .then((allUsers) => res.json(allUsers))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((singleUser) =>
        !singleUser
          ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
          : res.json(singleUser)
      )
      .catch((err) => res.status(500).json(err));
  },
  // CREATE a new user
  createUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err));
  },
  // UPDATE a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body }
    ) 
      .then((updateUser) => 
        !updateUser
        ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
        : res.json(updateUser)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a user 
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((deleteUser) => {
        // delete the user's associated thoughts
        return Thought.deleteMany( { _id: { $in: deleteUser.thoughts } } )
      })
      .then(() => res.json({ message: 'The user and their thoughts have been deleted.'}))
      .catch((err) => res.status(500).json(err));
  },
  // CREATE a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } }
    ) 
      .then((addFriend) => 
        !addFriend
        ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
        : res.json(addFriend)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } }
    ) 
      .then((deleteFriend) => 
        !deleteFriend
        ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
        : res.json(deleteFriend)
      )
      .catch((err) => res.status(500).json(err));
  },
};