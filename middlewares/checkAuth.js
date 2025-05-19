const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

const checkAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }
    jwt.verify(token, secret, {}, (err, data) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' })
      }
      next()
    })
  } catch (error) {
    console.error(error)

    res.status(500).send(error)
  }
}
module.exports = checkAuth
