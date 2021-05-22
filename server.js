const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((con) => console.log('connected to the db!'));

const app = require('./app');

// console.log(process.env);
const port = process.env.PORT;
app.listen(port, () => console.log(`server started at port ${port}`));
