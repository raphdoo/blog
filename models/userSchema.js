//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

//modelling the leader schema
const UserSchema = new Schema({
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

UserSchema.plugin(passportLocalMongoose)

const users = mongoose.model("User", UserSchema) //creating the model

module.exports = users //exporting the created model