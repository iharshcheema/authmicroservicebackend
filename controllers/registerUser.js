const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide every field',
      })
    }
    // save user in db
    await User.create({
      username: username,
      password: bcrypt.hashSync(password, saltRounds),
      email: email,
    })
    res.status(201).json({
      success: true,
      message: 'User has been registered successfully, now you can login',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred',
    })
  }
}

module.exports = registerUser
