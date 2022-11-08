const { Schema, model } = require('mongoose');

// Reaction schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if (date) return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} `;
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Thought schema to create the Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
      get: (date) => {
        if (date) return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} `;
      },
    },
    username: {
      type: String,
      required: true,
    },
    // Array of nested documents created with reactionSchema
    reactions: [reactionSchema], 
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Virtual for retrieving length of reactions array
thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;