require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const dbConnection = require('./config/dbConnection');
const categoryRouter = require('./routes/category');
const app = express();
 
/// MiddleWares
if (process.env.ENV === 'DEVELOPMENT') app.use(morgan('dev'))
app.use(express.json())

/// Routes
app.use('/api/v1/categories',categoryRouter)
///
const port = process.env.DB_PORT || 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

/// DB Connection
dbConnection() 