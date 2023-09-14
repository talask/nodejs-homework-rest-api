const { User } = require('../models/user')
const {HttpError, ctrlWrapper, imageToJimp} = require('../helpers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env;
const gravatar = require('gravatar')
const path = require('path');


const avatarDir = path.join(__dirname, '../', 'public', 'avatars')

const register = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarUrl
    });


    res.status(201).json({
        user: {
            email,
            subscription: newUser.subscription,
        },
    })
}

const login = async (req, res) => {
   
    const { email,password } = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(401, 'Email or pasword is wrong')
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
    
    const resultUpload = path.join(avatarDir, filename)
    imageToJimp(tempUpload, resultUpload);
  

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
}