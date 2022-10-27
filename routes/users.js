var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const { createUser, loginUser, logoutUser, updateUserById, getAllUser, getOneUser} = require('../controller/user')

router.use(bodyParser.json())

/* GET users listing. */
router.route('/')
  .get(authenticate.verifyAdmin, getAllUser)

router.route('/signup')
.post(createUser)

router.route('/login')
  .get(passport.authenticate('local'), loginUser)

router.route('/logout')
  .get(authenticate.verifyAdmin, logoutUser)





module.exports = router;
