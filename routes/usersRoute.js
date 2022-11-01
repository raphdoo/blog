var express = require('express');
var userRouter = express.Router();
var passport = require("passport")
const bodyParser = require("body-parser");
const { createUser, loginUser, logoutUser, updateUserById, getAllUser, getOneUser} = require('../controller/user')

const authenticate = require('../middleware/autheticate')

userRouter.use(bodyParser.json())

/* GET users listing. */
userRouter
  .route('/')
  .get(getAllUser)

userRouter.route('/signup')
.post(createUser)

userRouter.route('/login')
  .post(loginUser)

userRouter.route('/logout')
  .get(logoutUser)





module.exports = userRouter;
