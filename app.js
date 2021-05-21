const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//body parser
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = 4000;

//  2. ROUTES MIDDLEWARES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//3. START SERVER
try {
  app.listen(port, () => {
    console.log(`app running on port:${port}`);
  });
} catch (err) {
  console.log(err);
}
