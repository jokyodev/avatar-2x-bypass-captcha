const router = require('express').Router()
const jwt = require('jsonwebtoken')
router.post('/', async (req, res, next) => {
  try {
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error.message)
  }
})

module.exports = router
