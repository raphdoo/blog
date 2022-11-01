//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//modelling the leader schema
const UserSchema = new Schema({
    email:{
        type: String,
        default: '',
        required: true
    },
    username:{
        type: String,
        default: ''
    },
    password:{
        type: String,
        default: '',
        required: true
    },
    firstname:{
        type: String,
        default: '',
        required: true
    },
    lastname:{
        type: String,
        default: '',
        required: true
    }
})



const users = mongoose.model("User", UserSchema) //creating the model

module.exports = users //exporting the created model