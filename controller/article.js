//importing modules
const mongoose = require("mongoose");
const Article = require('../models/articleSchema')
const passport = require('passport')
const bodyParser = require("body-parser");
const { readingTime } = require("../utils/readCount");


const createArticle = async (req, res, next) => {
  /**
   * create new product with required parameters
   */
  try{
    const { title, description, tags, body } = req.body;
    const newArticle = new Article({
      title,
      description,
      tags: tags.split(',') || [tags],
      author: req.user._id,
      body,
      reading_time: readingTime(body)
    })
    await newArticle.save()

    const article = await Article.findOne({ _id: newArticle._id}).populate('author')
    
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({status: true, article})
  }catch(err){
    res.status(404).json({err: err})
  }
}

const getAllArticles = async (req, res, next) => {
  try{
    const page = parseInt(req.query.page)-1 || 0
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    let order = req.query.order || 'readCount'
    req.query.order ? (order = req.query.order.split(",")) : (order = [order])
    let sortBy = {}
    if(order[1]){
      sortBy[order[0]] = order[1]
    }else{
      sortBy[order[0]] = 'asc'
    }
    let regex = new RegExp(search, 'i');
    const articles = await Article.find({
        state: 'published',
        $and: [
            {
                $or: [
                    { title: regex },
                    { tags: regex }
                ],
            },
        ],
    },
    ).populate('author')
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({status: true, page: page+1, limit, articles})
  }catch(err){
    res.status(404).json({err: err})
  }
}

const getUserArticles = async (req, res, next) => {
    const userID = req.params.userID
    const page = parseInt(req.query.page)-1 || 0
    const limit = parseInt(req.query.limit) || 20
    const state = req.query.state || "published"
    


    console.log(req.user)
    const articles = await Article.find({author: userID, state: state})
    .skip(page * limit)
    .limit(limit).populate('author')

    res.status(200).json({ status: true, page: page+1, limit, articles })
      
  
}

const getAnArticle = async (req, res, next) => {
  try{
    const { articleID } = req.params// destructured the req.params.id and passed it to var
    const article = await Article.findById(articleID).populate('author')
    article.read_count++
    await article.save()
    res.status(200).json({ article })
      
  }catch(err){
    res.status(404).json({err: err})
  }
}

const updateArticle = async (req, res, next) => {
  try{
    const articleID = req.params.articleID

    const article = await Article.findByIdAndUpdate(articleID, { $set: req.body }, { new: true })
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'article updated successfully', article})    
  }catch(err){
    res.status(404).json({err:err})
  }
}  

const updateState = async (req, res, next) => {
  try{
    const articleID = req.params.articleID

    const article = await Article.findByIdAndUpdate(articleID, { $set: req.body }, { new: true })
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'article updated successfully', article})    
  }catch(err){
    res.status(404).json({err:err})
  }

}

const deleteArticle = async (req, res, next) => {
  try{
    const articleID = req.params.articleID
    const response = await Article.findOneAndRemove(articleID)
    res.setHeader('Content-Type', 'application/json')

    res.status(200).json({ msg: 'article deleted successfully', response})

  }catch(err){
    res.status(404).json({err:err})
  }
}



module.exports = {
  createArticle,
  getAllArticles,
  getAnArticle,
  updateArticle,
  deleteArticle,
  getUserArticles,
  updateState,
}
