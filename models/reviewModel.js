const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema({
    createdAt: {
        type: Date, 
        default: Date.now, 
    }, 
    review: {
        type: String, 
        required: [true, 'A tour must have a review'],
        min: [10, 'A review must be at least 10 characters...'] 
    }, 
    rating: {
        type: Number, 
        required: [true, 'A tour must require a rating'], 
        min: 0, 
        max: 5
    }, 
    user: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: [true, 'A review must belong to a user']
        }
    ], 
    tour: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Tour', 
        required: [true, 'A review must belong to a tour']
    }
}, 
{
    toJSON: {virtuals: true}, 
    toObject: {virtuals: true}
});

const Review = new mongoose.model('Review', reviewSchema); 

module.exports = Review; 