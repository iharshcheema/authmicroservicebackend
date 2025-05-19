const mongoose = require('mongoose')
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  used: { type: Boolean, default: false },
})

const OTP = mongoose.model('OTP', otpSchema)
module.exports = OTP
