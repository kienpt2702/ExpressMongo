const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    firstname: {
        type: String,
        default: '',
    },
    lastname: {
        type: String,
        default: '',
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String,
});

//configure option for passport local mongoose
const options = {
    errorMessages: {
        UserExistsError: 'Username already existed',
        IncorrectUsernameError: 'Username does not exist',
        IncorrectPasswordError: 'Incorrect password',
    }
};

// use passport local mongoose that add salted hashed password + username
userSchema.plugin(passportLocalMongoose, options);
module.exports = mongoose.model('User', userSchema);