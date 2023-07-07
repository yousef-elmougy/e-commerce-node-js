const mongoose = require("mongoose");

const dbConnection = () =>
  mongoose
    .connect(process.env.DB)
    .then((conn) =>
      console.log(`DB Connected Successfully: ${conn.connection.host}`)
    );

module.exports = dbConnection;
