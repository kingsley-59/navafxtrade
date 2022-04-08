const mongoose = require('mongoose');
require('dotenv').config();
const dbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? "mongodb+srv://kingsley-59:<password>@cluster0.mxd6h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log({dbConnectionString});



function ConnectDatabase() {
    let conn = mongoose.connect(dbConnectionString, {
        useNewUrlParser: true
        // useFindAndModify: false,
        // useUnitedTopology: true
    }).then(() => console.log('Connected...'))
    .catch((error) => console.log("Error occurred: ", error.message))

    return conn;
}

module.exports = ConnectDatabase;