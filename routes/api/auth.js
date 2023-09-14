const express = require('express')

const ctrl = require('../../controllers/auth')
const { validateBody, authenticate } = require('../../middlewares')
const { signInSchema, loginSchema } = require('../../models/user')

const router = express.Router()

router.post('/register', validateBody(signInSchema), ctrl.register);
router.post('/login', validateBody(loginSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.getCurrent);



module.exports = router;