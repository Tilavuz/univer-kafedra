const mongoose = require('mongoose')
const base = process.env.BASE
const db = async () => {
    mongoose.connect(base)
        .then(() => {
            console.log('Connected to the base');
        })
        .catch((err) => {
            console.log('not connected to the base', err);
        })
}

module.exports = db