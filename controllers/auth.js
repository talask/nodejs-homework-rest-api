const { User } = require('../models/user')
const {HttpError, ctrlWrapper, imageToJimp, sendEmail} = require('../helpers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY, BASE_URL } = process.env;
const gravatar = require('gravatar')
const path = require('path');
const fs = require('fs/promises')
const { v4: uuidv4 } = require('uuid');


const avatarDir = path.join(__dirname, '../', 'public', 'avatars')

const register = async (req, res) => {
   
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    const verificationCode = uuidv4()
    
    const newUser = await User.create({...req.body, password: hashPassword, avatarUrl,verificationToken: verificationCode});
    
    const verifyEmail = {
        to: email, 
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click verify</a>`
    }

    await sendEmail(verifyEmail)
    
    res.status(201).json({
        user: {
            email,
            subscription: newUser.subscription,
        },
    })
}

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({verificationToken})

    if(!user){
        throw HttpError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})

    res.json({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) => { 
    const { email } = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(404, "Not found email")
    }

    if(user.verify) {
        throw HttpError(404, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email, 
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify</a>`
    }

    await sendEmail(verifyEmail)

    res.json({
        message: "Verification email sent"
    })

}

const login = async (req, res) => {
   
    const { email,password } = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(401, 'Email or pasword is wrong')
    }
    if(!user.verify) {
        throw HttpError(401, 'Email not verify')
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
   
    if(!passwordCompare){
        throw HttpError(401, 'Email or pasword is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload,SECRET_KEY, { expiresIn: '20h' });
    await User.findByIdAndUpdate(user._id, { token });
    
    const { subscription } = user;
    res.json({
        token,
        user: {
            email,
            subscription,
        }
    })
}

const getCurrent = async (req,res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,

    })
}

const logout = async (req, res) => { 

const { _id } = req.user;
await User.findByIdAndUpdate(_id, { token: "" })

res.status(204).send();

}

const updateAvatar = async (req, res) => {

    const { _id } = req.user;
    const {  path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    
    const resultUpload = path.join(avatarDir, filename);

    await imageToJimp(tempUpload, resultUpload);
            
    await fs.unlink(tempUpload);
  

    const avatarUrl = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarUrl })

    res.json({
        avatarUrl,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}