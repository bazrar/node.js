const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must require a name'],
    unique: true,
  },
  ratings: {
    type: Number,
    required: true,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must require a price'],
  },
});

const tour = new mongoose.model('Tour', tourSchema);

module.exports = tour;
