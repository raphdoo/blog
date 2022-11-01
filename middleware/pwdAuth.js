const argon2 = require("argon2")
const jwt = require('jsonwebtoken');
const config = require("../config");

const User = require("../models/userSchema")

async function hashPassword(password) {
    return await argon2.hash(password);
}

async function verifyPassword(plainPassword, hashedPassword) {
    return await argon2.verify(hashPassword, plainPassword)
}


async function validateUser(email, password) {
    let user = await User.findOne({ email: email }).select('+password')
    if (!user) {
        return false
    }
    const verifyPassword = await argon2.verify(user.password, password)
    if (!verifyPassword) {
        return false
    }
    return user;
}

module.exports = {
    hashPassword,
    verifyPassword,
    validateUser
}