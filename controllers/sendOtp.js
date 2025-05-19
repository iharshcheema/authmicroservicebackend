const User = require('../models/User')
const OTP = require('../models/Otp')
const { otpGen } = require('otp-gen-agent')
const nodemailer = require('nodemailer')

const sendOtp = async (req, res) => {
  try {
    const { username, email } = req.body

    if (!username || !email) {
      return res.status(400).json({
        success: 'false',
        message: 'Provide username and Email',
      })
    }
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email })
    // If user found with provided email
    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message:
          'A user already exists with the current Email. Please use a different Email.',
      })
    }
    // Check if the username is taken
    const existingUser = await User.findOne({ username: username })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is taken, chose another username!',
      })
    }
    // generate otp
    const otp = await otpGen()

    // Save otp in db
    await OTP.create({ email, otp })

    // Send OTP via email
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

    const mailOptions = {
      from: {
        name: 'AUTH',
      },
      to: email,
      subject: 'OTP Verification',
      html: `
        <p>You requested a OTP</p>
        <p>Use: ${otp} to continue your registration process</p>
      `,
    }

    await transporter.sendMail(mailOptions).then(() => console.log('emailsent'))

    res.status(200).json({
      success: true,
      message: 'OTP has been sent on your Email address',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Servor error',
    })
  }
}

module.exports = sendOtp
