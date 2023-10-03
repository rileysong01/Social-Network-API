const { Schema, model } = require('mongoose');

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
            match: [
                /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                'Invalid email format. Please provide a valid email address.'
            ]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectUd,
                ref: 'Thought'
            }
        ]
    }
)

const User = model('user', userSchema)

module.exports = User;