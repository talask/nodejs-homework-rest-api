const { User } = require('../models/user')
const {HttpError, ctrlWrapper} = require('../helpers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email ,password } = req.body;

    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        email: newUser.email,
        password: newUser.password,
    })
}

const login = async (req, res) => {
   
    const { email,password } = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(401, 'Email not found')
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
   
    if(!passwordCompare){
        throw HttpError(401, 'Pasword not found')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload,SECRET_KEY, { expiresIn: '20h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
    })
}

const getCurrent = async (req,res) => {
    const { email, password } = req.user;

    req.json({
        email,
        password,

    })
}

const logout = async (req, res) => { 

const { _id } = req.user;
await User.findByIdAndUpdate(_id, { token: "" })

res.status(204).send();

}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
}