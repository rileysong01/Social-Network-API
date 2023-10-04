const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const moment = require('moment');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 1 && value.length <= 280;
                },
                message: 'Thought text must be between 1 and 280 characters'
            }
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function (timestamp) {
                return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        },
    }
)

const Thought = model('thoughts', thoughtSchema)

module.exports = Thought;