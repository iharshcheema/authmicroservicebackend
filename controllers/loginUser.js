const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide credentials',
      })
    }

    const userinDB = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
    // check if user exists in db
    if (!userinDB) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed! User do not exists',
      })
    }

    // compare the password
    const passCompare = await bcrypt.compare(password, userinDB.password)

    //  do not matches
    if (!passCompare) {
      return res.status(403).json({
        success: false,
        message: 'Wrong credentials',
      })
    } else {
      // matches
      jwt.sign(
        { username: userinDB.username, id: userinDB._id },
        secret,
        {},
        (err, token) => {
          if (err) {
            throw err
          }
          res
            .status(200)
            .cookie('token', token, {
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            })
            .json({
              payload: userinDB.username,
              success: true,
              message: 'Signed in',
            })
        }
      )
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal error occurred, couldnt login the user',
    })
    console.error(error)
  }
}

module.exports = loginUser
