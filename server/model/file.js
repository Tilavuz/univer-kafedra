const { Schema, model } = require('mongoose')

const fileSchema = new Schema({
    loginId: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    pending: {
        type: Boolean,
        default: undefined
    },
    answer: {
        type: String,
        default: undefined
    }
})

module.exports = model('File', fileSchema)