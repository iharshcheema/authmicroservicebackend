const express = require('express')
const router = express.Router()

const registerUser = require('../controllers/registerUser')
const loginUser = require('../controllers/loginUser')
const checkLoginOnStart = require('../controllers/checkLoginOnStart')
const logOutUser = require('../controllers/logoutUser')
const changePassword = require('../controllers/changePassword')
const forgotPassword = require('../controllers/forgotPassword')
const resetPass = require('../controllers/resetPassword')
const verifyOtp = require('../middlewares/verifyOtp')
const checkAuth = require('../middlewares/checkAuth')
const sendOtp = require('../controllers/sendOtp')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'WELCOME',
  })
})

// check if the user is logged in
router.get('/check-login-on-start', checkLoginOnStart)

// register
router.post('/generate-otp', sendOtp)
router.post('/register', verifyOtp, registerUser)

// login
router.post('/login', loginUser)
// change the passwords if user is logged in
router.post('/change-pass', checkAuth, changePassword)

// logout
router.post('/logout', checkAuth, logOutUser)

// forgot and reset password
router.post('/forgot-pass', forgotPassword)
router.post('/reset-pass/:token', resetPass)

// 404s
router.all('*', (req, res) => {
  res.status(404).json({
    message: 'NOT FOUND',
  })
})

module.exports = router
