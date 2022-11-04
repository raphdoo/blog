const mongoose = require("mongoose");
const User = require('../models/userSchema')
var passport = require("passport")
const bodyParser = require("body-parser")
const {
  hashPassword,
  verifyPassword,
  validateUser
} = require('../middleware/pwdAuth')

const authenticate = require('../middleware/autheticate')

async function createUser(req, res) {
  const { firstname, lastname, email, password } = req.body;
  let userExist = await User.findOne({ email: email })
  if (userExist) {
      return res.status(403).send("This user already exist!")
  }
  const newUser = {
      firstname,
      lastname,
      email,
      password
  }
  const hashedPassword = await hashPassword(newUser.password)
  newUser.password = hashedPassword
  const user = await User.create(newUser)
  user.username = email
  await user.save()
  res.status(201).json({
      message: "Registration successful!",
      user: user
  })
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    const user = await validateUser(email, password)
    if (!user) {
        return res.status(401).json({success:false, message:"invalid credential"})
    }
    var token = authenticate.getToken({ _id: user._id })
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, token })
}

const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('jwt')
        res.json({ status: true, message: 'logout successful' })
    } catch (err) {
        res.status(500).send(err)
    }
}

async function getAllUser (req, res, next) {
    try{
        const user = await User.find({});
        res.status(200).json({
            msg: "all users",
            data: user
        })        
    }catch(err){
        res.status(500).json({err:err, status:false})
    }
}

async function getOneUser(req, res) {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).send("User with this id does not exist!")
    }
    res.status(200).send(user)
}

async function updateUserById(req, res, next) {
    const id = req.params.id;
    const bodyToUpdate = req.body;

    let user = await User.findByIdAndUpdate(id, bodyToUpdate, { new: true });

    if (!user) {
        return res.status(404).send("User does not exit")
    }
    res.status(201).json({
        msg: "User updated Successfully",
        data: user
    })
};


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUserById,
    getAllUser,
    getOneUser
}