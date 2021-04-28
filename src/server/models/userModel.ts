import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userModel = new Schema({
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        unique: true,
        min: 3,
        max: 100,
        required: false
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 225
    },
    address:{
        type: Map,
        of: String,
        required: true,
    },
    active:{
        type: Boolean,
        default: false
    },
    ePin:{
        type: Number,
        required: false
    },
    photo:{
        type: String,
        required: false
    },
    businessType:{
        type: String,
        required: false
    },
    cacDoc:{
        type: String,
    },
    licenseDoc:{
        type: String
    },
    documentVerified:{
        type: Boolean,
        default: false
    },
    userType:{
        type: String,
        enum: ["EXPRESS", "PORTAL"],
        default: "EXPRESS",
        required: true
    },
    walletBalance:{
        type: Number,
        default: 0
    },
    health_description:{
        type: Map,
        of: String,
        required: false
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userModel);

export default User;