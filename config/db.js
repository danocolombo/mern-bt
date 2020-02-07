const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log('MongoDb connected');
    } catch (err) {
        //if we cannot connect we want to stop the process
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;
