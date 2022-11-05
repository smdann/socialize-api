const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Function for validating a user's email address using valid email regex
let emailValidation = function(email) {
  const regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  return regex.test(email);
};

// User schema to create the User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [emailValidation, 'Enter a valid email address'],
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Enter a valid email address']
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // Include virtuals in JSON response
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual for retrieving length of user's friends array
userSchema
  .virtual('friendCount')
  .get(function () {
    return this.friends.length;
  });

const User = model('User', userSchema);

module.exports = User;
