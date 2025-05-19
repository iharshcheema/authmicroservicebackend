const crypto = require('crypto')
const PasswordResetToken = require('../models/PasswordResetToken')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10

const resetPass = async (req, res) => {
  try {
    // Extract the token from the URL parameters
    const { token } = req.params
    const { password } = req.body
    if (!password) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide a new password to reset your password',
      })
    }

    //   hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    //  find a token in db that matches our token
    const tokenInDb = await PasswordResetToken.findOne({
      token: hashedToken,
      expiry: { $gt: Date.now() },
    })

    //   if token is invalid or is expired
    if (!tokenInDb) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }

    //   find the user by its _id
    const user = await User.findById(tokenInDb.userId)

    //   update the password
    user.password = await bcrypt.hash(password, saltRounds)

    //   save in db
    await user.save()

    //  delete the token in db
    await PasswordResetToken.deleteOne({ _id: tokenInDb._id })

    //   send response
    res.status(200).json({
      message: 'Password has been changed',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while verifying OTP',
    })
  }
}

module.exports = resetPass
