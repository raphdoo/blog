//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema;


//modelling the dish schema
const articleSchema = new Schema({
    title: {
        type : String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    readCount: {
        type: Number,
        default: 0
    },
    readTime: {
        type: Number,
        default: 0
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true 
})

const article = mongoose.model('article', articleSchema)

module.exports = article