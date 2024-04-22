const mongoose = require('mongoose')
const base = process.env.BASE

const db = async () => {
    mongoose.connect(base)
        .then(() => {
            console.log('Connected to the base');
        })
        .catch(() => {
            console.log('not connected to the base');
        })
}

module.exports = db