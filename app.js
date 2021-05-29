const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//serving static files
app.use(express.static(`${__dirname}/public`));

//body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = 4000;

//  2. ROUTES MIDDLEWARES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use(errorHandler)

module.exports = app;
