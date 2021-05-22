const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

console.log(__dirname);
// console.log(process.env);

const db_url = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('connnected to the database!'));

//read json file

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// console.log(tours);
// import data into db

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data is successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from the collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// console.log(process.argv);

if ('--import' === process.argv[2]) {
  importData();
} else if ('--delete' === process.argv[2]) {
  deleteData();
}
