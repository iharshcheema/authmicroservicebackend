const OTP = require('../models/Otp')

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({
      success: 'false',
      message: 'Provide correct-Email and OTP to verify your OTP',
    })
  }

  try {
    const otpRecord = await OTP.findOne({ email, otp }).exec()
    // Check if OTP dont exist or is invalid
    if (!otpRecord || otpRecord.used) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP',
      })
    }

    // Mark OTP as used
    otpRecord.used = true
    await otpRecord.save()

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while verifying OTP',
    })
  }
}

module.exports = verifyOtp
