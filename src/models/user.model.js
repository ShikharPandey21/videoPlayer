import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jasonwebtoken"

const userSchema = new Schema({
    username:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim :true,
        index : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
        lowercase : true,
        trim :true,
    },
    fullName:{
        type : String,
        require :true,
        trim :true,
        index : true
    },
    avatar:{
        type :String,
        require:true,
    },
    covetImage : {
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref :"Video"
        }
    ],
    password:{
        type:String,
        required : [true, 'Password is required']
    },
    refreshTokens:{
        types:fString    }

},{timestamps:true})

userSchema.pre( function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        username : this.username,
        email : this.email,
        fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)