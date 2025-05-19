const User = require('../models/User')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const PasswordResetToken = require('../models/PasswordResetToken')

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide Email address',
      })
    }
    // find user
    const user = await User.findOne({ email })
    //   if no user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Enter the correct email',
      })
    }

    // token
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const expiry = Date.now() + 3600000 // 1 hour from now

    // save hashed token in db
    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiry,
    })

    //reset url
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`

    // nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: false,

      auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS,
      },
    })

    //  mail options
    const mailOptions = {
      from: {
        name: 'AUTH',
      },
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
      `,
    }

    // send mail
    await transporter.sendMail(mailOptions).then(() => console.log('emailsent'))

    res.status(200).json({
      success: true,
      message: 'Reset password link has been sent on your email',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal error occurred',
    })
  }
}
module.exports = forgotPassword
