const userModel = require("../model/userSchema");
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const signup = async (req , res) => {
    //code here

    const {name , email , password , confirmPassword} = req.body;
    console.log(name , email , password , confirmPassword);

    try {

        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message: "All fields are required to fill"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message: "Password and confrimPassword don't match"
            });
        }

        const validEmail = emailValidator.validate(email);

        if(!validEmail){
            return res.status(400).json({
                success:false,
                message: "Email is not valid"
            });
        }
        const userInfo = userModel(req.body);
        const result = await userInfo.save();

        return res.status(200).json({
            success: true,
            data : result
        })
    } catch (e) {

        if(e.code === 11000){
            return res.status(200).json({
                success: false,
                message : "Account already exits"
            })
        }
        return res.status(200).json({
            success: false,
            message : e.message
        })
    }

    
}

const signin = async (req , res) => {
    //code here

    const {email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message: "Every field is required"
        });
    }

    try {
        const user = await userModel.findOne({email}).select("+password");

        if(!user || ! await bcrypt.compare(password , user.password)){
            return res.status(400).json({
                success:false,
                message: "Invalid credentials"
            });
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOptions = {
            maxAge : 24 * 60 * 60 * 1000,
            httpOnly: true
        }

        res.cookie("Token" , token , cookieOptions);

        res.status(200).json({
            success: true,
            data : user
        })

    } catch (e) {
        return res.status(400).json({
            success:false,
            message: e.message
        });
    }
}

const getUser = async (req , res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);

        return res.status(200).json({
            success : true,
            data : user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message : e.message
        })
    }
}

const logout = async (req , res) => {
     
    try {
        const cookieOption = {
            expiresIn : new Date(),
            httpOnly : true
        }

        res.cookie("token" , null, cookieOption);

        res.status(200).json({
            success:true,
            message: "Logged Out!!"
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}