const express = require('express')
const router = express.Router()
const {validateUser, validateSubscriptionStatus} = require('./userValidate')
const { signup, login, logout, current} = require('../../controllers/users')
const guard = require('../../helpers/guard')
const loginLimit = require('../../helpers/rate-limit-login')

router.post('/signup', validateUser, signup)
router.post('/login', validateUser, loginLimit, login)
router.post('/logout', guard, logout)
router.post('/current', guard, current)
// router.post('/subscription', guard, updateSubscription)
module.exports = router
