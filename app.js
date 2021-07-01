const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

//app
const app = express();

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => console.log('not connected'));

  // bring in routes
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/user');
  const categoryRoutes = require('./routes/category');
  const productRoutes = require('./routes/product');


  // middleware
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressValidator());
  app.use(cors())

  // routes middleware
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', categoryRoutes)
  app.use('/api', productRoutes)

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})