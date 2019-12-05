const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String, 
        required: true,
        trim: true,
        minlength: 6,
        validate (value) {
            if (value.toUpperCase().includes ("PASSWORD")) {
                throw new Error('Password cannot include \"password\"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email :{
        type: String, 
        required: true,
        trim: true,
        lowercase: true,
        unique: true,    //Doesn't work
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid')
            }
        }
    },
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne ({email: email});
    if (!user) {
        throw new Error ('Unable to login')
    }
    const isMatch = await bcrypt.compare (password, user.password);
    if (!isMatch) {
        throw new Error ('Unable to login')
    }
    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()      // tells mongoose that we are finished
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign ({ _id: user.id.toString()}, 'doDaStuff');
    user.tokens = user.tokens.concat ({token: token});
    await user.save();
    return token;
};

// set up virtual property for the user/task relationship
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {       // Standard serialization hook
    const user = this;
    const userObject = user.toObject ();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const User = mongoose.model('User', userSchema);

module.exports = User;