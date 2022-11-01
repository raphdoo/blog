//importing the mongoose database ORM
const mongoose = require("mongoose");
const userRouter = require("../routes/usersRoute");
const Schema = mongoose.Schema;


//modelling the article schema
const articleSchema = new Schema({
    title: {
        type : String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    body: {
        type: String,
        required: true,
        unique: true
    },
    tags: [{
        type: String
    }],
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
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