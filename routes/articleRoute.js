var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const authenticate = require('../middleware/autheticate')
const {
  createArticle,
  getAllArticles,
  getAnArticle,
  updateArticle,
  deleteArticle,
  getUserArticles,
  updateState,
} = require('../controller/article')

router.use(bodyParser.json())

/* GET users listing. */

router.route('/')
  .get(getAllArticles)
  .post(authenticate.verifyUser, createArticle)

  router.route('/user/:userID')
  .get(authenticate.verifyUser, getUserArticles)


router.route('/:articleID')
  .get(getAnArticle)
  .put(authenticate.verifyUser, authenticate.verifyAuthor, updateArticle)
  .patch(authenticate.verifyUser, authenticate.verifyAuthor, updateState)
  .delete(authenticate.verifyUser, authenticate.verifyAuthor, deleteArticle)

module.exports = router;
