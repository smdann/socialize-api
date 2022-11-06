const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

module.exports = {
  // GET all of the users
  getAllUsers(req, res) {
    User.find()
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
  // DELETE a user and the user's associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((deleteUser) => 
        !deleteUser 
          ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
          : Application.deleteMany({ _id: { $in: User.thoughts } })
      )
      .then(() => res.json({ message: 'The user and their thoughts have been deleted.'}))
      .catch((err) => res.status(500).json(err));
  },
  // UPDATE a user - add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body } }
    ) 
      .then((addFriend) => 
        !addFriend
        ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
        : res.json(addFriend)
      )
      .catch((err) => res.status(500).json(err));
  },

  // UPDATE a user - delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { userId: req.params.userId } } }
    ) 
      .then((deleteFriend) => 
        !deleteFriend
        ? res.status(404).json({ message: 'Sorry, no user returned with that ID!'})
        : res.json(deleteFriend)
      )
      .catch((err) => res.status(500).json(err));
  },
};