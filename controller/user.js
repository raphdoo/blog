const User = require('../models/userSchema')
var passport = require("passport")
const { body, validationResult } = require("express-validator")
const bodyParser = require("body-parser")

const authenticate = require('../middleware/authenticate')

async function createUser(req, res) {
    const user = await User.register( new User({email:req.body.email}), req.body.password)
    if(!user){
        var err = new Error("You are not logged in")
        err.status = 403;
        return next(err)
    }
    if(req.body.firstname){
        user.firstname = req.body.firstname
    }
    if(req.body.lastname){
        user.lastname = req.body.lastname
    }

    await user.save()
    passport.authenticate('local')(req,res, ()=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, status:'registration successful', data: user})
    })
};

const loginUser = async (req, res) => {
    const { identity, password } = req.bo
    const user = await validateUser(identity, password)
    if (!user) {
        return res.status(401).send("Invalid crendentials!")
    }
    var token = authenticate.getToken({ _id: user._id })
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, token, status: 'You are successfully logged in' })
}

const logoutUser = async (req, res) => {
    try {
        console.log(req.user)
        res.clearCookie('jwt')
        console.log('logout successful')

        await req.user.save()
        res.json({ status: true, message: 'logout successful' })
    } catch (err) {
        res.status(500).send(err)
    }
}

async function getAllUser(req, res) {
    const user = await userModel.find({});
    res.status(200).json({
        msg: "all users",
        data: user
    })
}

async function getOneUser(req, res) {
    const userId = req.params.id
    const user = await userModel.findById(userId)
    if (!user) {
        return res.status(404).send("User with this id does not exist!")
    }
    res.status(200).send(user)
}

async function updateUserById(req, res) {
    const id = req.params.id;
    const bodyToUpdate = req.body;

    let user = await userModel.findByIdAndUpdate(id, bodyToUpdate, { new: true });

    if (!user) {
        return res.status(404).send("User does not exit")
    }
    res.status(201).json({
        msg: "User updated Successfully",
        data: user
    })
};

async function deleteUserById(req, res) {
    const id = req.params.id;

    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
        return res.status(404).send("Can't delete! user does not exist!")
    }
    user.delete()
    res.json({
        status: 200,
        msg: "User deleted successfully!"
    })
}


async function getSellers(req, res, next){
    const sellers = await userModel.aggregate([
        {
            $match: {
                usertype: "business"
            }
        }
    ])
    res.status(200).json({status:true, sellers:sellers})
}

async function getSellerById(req, res){
    const sellerId = req.params.id
    const seller = await userModel.findOne({_id: sellerId, usertype: "business"})

    res.status(200).json({
        status: true,
        seller: seller
    })
}


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUserById,
}