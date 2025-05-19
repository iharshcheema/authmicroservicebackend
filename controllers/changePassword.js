const bcrypt = require('bcrypt')
const User = require('../models/User')

const saltRounds = 10

const changePassword = async (req, res) => {
  try {
    const { user, currentPassword, newPassword } = req.body
    if (!user || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide every field',
      })
    }
    // find the user
    const userinDB = await User.findOne({
      username: user,
    })
    if (!userinDB) {
      return res.status(401).json({
        success: false,
        message: 'User do not exist',
      })
    }

    // compare the password
    const passCompare = await bcrypt.compare(currentPassword, userinDB.password)

    //  do not matches
    if (!passCompare) {
      return res.status(403).json({
        success: false,
        message: 'Wrong credentials, couldnt change your password',
      })
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hashSync(newPassword, saltRounds)

    // Update user's password in the database
    await User.findOneAndUpdate(
      { username: user },
      { password: hashedNewPassword },
      { new: true }
    )

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = changePassword
