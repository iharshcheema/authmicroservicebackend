const mongoose = require('mongoose')
const passwordResetTokenSchema = new mongoose.Schema({
  // the following is the _id of the user
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expiry: { type: Date, required: true },
})

const passwordResetToken = mongoose.model(
  'PasswordResetToken',
  passwordResetTokenSchema
)
module.exports = passwordResetToken
