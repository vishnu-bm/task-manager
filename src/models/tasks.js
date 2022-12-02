const mongoose = require('mongoose');
const validator = require('validator')

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})
taskSchema.pre('save', async function (next) {
    const task = this
    // console.log('wllaaa')
    next()
})
const NewTask = mongoose.model("NewTask", taskSchema)

module.exports = NewTask