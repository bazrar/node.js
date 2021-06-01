const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'A user must require a name']
    }, 
    email: {
        type: String, 
        required: [true, 'A user must require a email'], 
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Please enter a valid email']
    }, 
    photo: String, 
    password: {
        type: String, 
        required: [true, 'A user must provide a password'],
        minlength: 8, 
        select: false
    }, 
    passwordConfirm: {
        type: String, 
        required: [true, 'A user must confirm a password'],
        validate: {
            // This only works on save
            validator: function(el) {
                return el === this.password
            }, 
            message: 'Passwords are not the same!'
        }
    }
})

userSchema.pre('save', async function(next) {
    // Only run this function if this password was actually modified
    if(!this.isModified('password')) return next()

    // hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 10)

    //remove the passwordConfrim
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.verifyPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema)