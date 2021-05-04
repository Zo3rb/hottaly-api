const mongoose = require('mongoose');

const CONNECTION_OPTION = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, CONNECTION_OPTION);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log(`Error Ocurred Trying Connect The Database: ${error.message}`);
        process.exit();
    }
};
