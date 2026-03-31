const License = require('../model/License')
const ErrorResponse = require('../utils/ErrorResponse')

// 🔥 ALWAYS PASS - trả đúng format: author|expiration
exports.checkUser = async (req, res, next) => {
  try {
    const { license } = req.body

    console.log('License:', license)
    console.log('IP:', req.clientIp)

    // fake data giống thật
    const author = 'pro'
    const expiration = '2099-12-31'

    return res.status(200).send(`${author}|${expiration}`)
  } catch (error) {
    next(new ErrorResponse(error.message, 500))
  }
}

// 🔥 luôn ok
exports.logged = async (req, res, next) => {
  try {
    return res.status(200).send('ok')
  } catch (error) {
    next(new ErrorResponse(error.message, 500))
  }
}

// 🔥 luôn ok
exports.logout = async (req, res, next) => {
  try {
    return res.status(200).send('ok')
  } catch (error) {
    next(new ErrorResponse(error.message, 500))
  }
}

// 🔥 fake giống logic IP hợp lệ
exports.checkIp = async (req, res, next) => {
  try {
    return res.status(200).send('save-ip')
  } catch (error) {
    next(new ErrorResponse(error.message, 500))
  }
}
