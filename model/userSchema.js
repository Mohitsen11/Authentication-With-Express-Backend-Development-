const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name : {
        type : String,
        required:[true , "Name is required"],
        minLength: [5 , "Length must be at least 5 chars"],
        maxLength : [50 , "Length must be less than 5 chars"],
        trim : true
    },

    email:{
        type :String,
        required:[true , "Email is required"],
        lowercase: true,
        unique: [true , "Already registered email"]
    },

    password :{
        type : String,
        select: false
    },

    forgotPasswordToken : {
        type : String
    },

    forgotPasswordExpiryDate: {
        type : String
    }
},{
    timestamps: true
});

userSchema.pre('save', async function(next) {

    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password , 10);
    return next();
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            {id : this._id , email: this.email},
            process.env.SECRET,
            {expiresIn : '24h'}
        )
    }
}

const userModel = mongoose.model("user" , userSchema);

module.exports = userModel;
