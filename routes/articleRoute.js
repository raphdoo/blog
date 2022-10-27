var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const {
  createArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  updateState,
} = require('../controller/user')

router.use(bodyParser.json())

/* GET users listing. */
router.route('/')
  .get(authenticate.verifyAdmin, getAllUser)

router.route('/')
.get(getAllArticles)
.post(createArticle)

router.route('/:articleID')
  .get(getArticle)
  .put(updateArticle)
  .patch(updateState)
  .delete(deleteArticle)

module.exports = router;
