const express = require('express')

const ctrl = require('../../controllers/auth')
const { validateBody, authenticate, upload } = require('../../middlewares')
const { signInSchema, loginSchema, emailSchema } = require('../../models/user')

const router = express.Router()

router.post('/register', validateBody(signInSchema), ctrl.register);
router.get('/verify/:verificationToken', ctrl.verifyEmail);
router.post('/verify', validateBody(emailSchema), ctrl.resendVerifyEmail);
router.post('/login', validateBody(loginSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.getCurrent);
router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar);



module.exports = router;