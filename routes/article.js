const { trusted } = require('mongoose')
const Article = require('../models/articleSchema')


const createArticle = async (req, res, next) => {
  /**
   * create new product with required parameters
   */
  try{
    const article = await Article.create(req.body)
    if(!article){
      var err = 'Create article failed'
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({err})
    }else{
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json({status: trusted, article})
    }

  }catch(err){
    next(err)
  }

}

const getAllArticles = async (req, res) => {
  try{
    const articles = await Product.find({}).populate('author')
    if(!articles){
      var err = 'Create article failed'
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({err})
    }else{
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json({status: trusted, articles})
    }    

  }catch(err){
    next(err)
  }
}



const getArticle = async (req, res) => {
  try{
    const { articleID } = req.params// destructured the req.params.id and passed it to var
    const article = await Article.findById(articleID).populate('author')
    if(!article){
      var err = 'Article not found'
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({err})
    }else{
      res.status(200).json({ article })
    }  
  }catch(err){
    next(err)
  }
}

const updateState = async (req, res) => {
  try{
    const articleID = req.params.id

    const article = await Article.findByIdAndUpdate(articleID, { $set: req.body.state }, { new: true })
    res.setHeader('Content-Type', 'application/json')
    if (!article) {
      return res.status(404).json({msg: 'article with id not found'})
    }
    res.status(200).json({ msg: 'product updated successfully', article })    
  }catch(err){
    next(err)
  }

}

const updateArticle = async (req, res) => {
  try{
    const articleID = req.params.id

    const article = await Article.findByIdAndUpdate(articleID, { $set: req.body }, { new: true })
    res.setHeader('Content-Type', 'application/json')
    if (!product) {
      return res.status(404).json({msg: 'article with id not found'})
    }
    res.status(200).json({ msg: 'product updated successfully', product })    
  }catch(err){
    next(err)
  }

}

const deleteArticle = async (req, res) => {
  try{
    const articleID = req.params.id
    const response = await Article.findOneAndRemove(articleID)
    res.setHeader('Content-Type', 'application/json')
    if (!response) {
      return res.status(404).json({msg:'article not found'})
    }

    res.status(200).json({ msg: 'product deleted successfully', response})

  }catch(err){
    next(err)
  }
}


const TopProducts = async (req, res, next) => {
  const products = await Product.aggregate([
    {
      // STAGE 1
      $addFields: {
        ratingSum: {
          $reduce: {
            input: "$ratings",
            initialValue: 0,
            in: {
              $add: ["$$value", "$$this.val"],
            },
          },
        },
      },
    },

    {//STAGE 2
      $addFields: {
        rating: {
          $cond: [
            { $eq: [{ $size: "$ratings" }, 0] },
            0,
            { $divide: ["$ratingSum", { $size: "$ratings" }] },
          ],
        },
      },
    },

    {//STAGE 3
      $sort: { rating: -1 },
    },

    {// STAGE 4
      $project: {
        ratings: 0, __v: 0, ratingSum: 0,
      },
    },

    { $limit: 5 },
  ]);

  return res.status(200).json({
    status: true,
    products,
  });
}


const latestProduct = async (req, res, next) => {
  /*SORT PRODUCTS BY DATE */
  const latestProducts = await Product.find({})
    .sort({ createdAt: "desc" })
    .limit(10);
  res.status(200).json({ status: true, latestProducts: latestProducts });

}


module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  TopProducts,
  latestProduct,

}
