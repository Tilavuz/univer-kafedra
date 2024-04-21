const mongoose = require('mongoose')


const db = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/kafedra')
        .then(() => {
            console.log('Connected to the base');
        })
        .catch(() => {
            console.log('not connected to the base');
        })
}

module.exports = db