require('dotenv').config();
// node module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//
const User = require('./../schemas/user-schema');
const tokenUtil = require('../../utils/token-util');
const dateTimeUtil = require('./../../utils/date-util');

const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUND));

async function saveUser(data) {
    let success = false;
    try {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: data.username,
            password: bcrypt.hashSync(data.password, salt)
        })
        const user = await User.findOne({ 'username': data.username });
        if (user && user.username) {
            console.error(`${dateTimeUtil.getCurrentDateTime()} User ${data.username} already exists`);
            return { success, message: 'User Already Exists', statusCode: 409 };
        } else {
            await newUser.save();
            success = true;
            console.log(`${dateTimeUtil.getCurrentDateTime()} User ${data.username} saved successfully`);
            return { success, message: 'User Saved Successfully', statusCode: 200 };
        }
    } catch (err) {
        console.error(`${dateTimeUtil.getCurrentDateTime()} Error while saving user ${err}`);
        return { success, message: 'Something went wrong', statusCode: 500 };
    }
}

async function loginUser(data) {
    let success = false;
    try {
        const user = await User.findOne({ username: data.username });
        if (user && user.username) {
            console.error(`${dateTimeUtil.getCurrentDateTime()} User ${data.username} Found`);
            const passwordMatch = bcrypt.compareSync(data.password, user.password);
            if (passwordMatch) {
                // generate a token and return that to the user
                const token = tokenUtil.generateToken({
                    id: user._id,
                    email: user.email
                });
                success = true;
                return { success, message: 'User login Success', statusCode: 200, data: { access_token: token } };
            } else {
                console.error(`${dateTimeUtil.getCurrentDateTime()} Password Mismatch for user ${data.username}`);
                return { success, message: 'Invalid username or password', statusCode: 401 };
            }
        } else {
            console.error(`${dateTimeUtil.getCurrentDateTime()} User ${data.username} not found`);
            return { success, message: 'User Not Found', statusCode: 404 };
        }
    } catch (err) {
        console.error(`${dateTimeUtil.getCurrentDateTime()} Error while saving user ${err}`);
        return { success, message: 'Something went wrong', statusCode: 500 };
    }
}

module.exports = {
    saveUser: saveUser,
    loginUser: loginUser
}