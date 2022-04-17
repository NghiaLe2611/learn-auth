const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB connected');
    } catch(err) {
        console.log(err);
    }
}

module.exports = { connect };