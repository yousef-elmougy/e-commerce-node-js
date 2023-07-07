const mongoose = require('mongoose')

const dbConnection = () =>
    mongoose.connect(process.env.DB).then((conn) => console.log(`DB Connected Successfully: ${conn.connection.host}`)).catch((err) => {
        console.log(`DB ERROR: ${err}`);
        process.exit(1)
    })

module.exports = dbConnection;