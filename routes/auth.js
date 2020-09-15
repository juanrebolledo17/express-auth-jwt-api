const router = require('express').Router()
const User = require('../model/User')
const { registerValidation } = require('./validation')
const { loginValidation } = require('./validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body)

  if (error) {
    res.status(400).json({error: error.details[0].message})
  }

  const ifEmailExist = await User.findOne({email: req.body.email})

  if (ifEmailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password,
  })

  try {
  	const savedUser = await user.save()
  	res.json({ error: null, data: { userId: savedUser._id } })
  } catch (error) {
  	res.status(400).json({ error })
  }
})

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)

  if (error) {
    res.status(400).json({error: error.details[0].message})
  }

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).json({ error: "Email is wrong" })
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password)

  if (!validPassword) {
    return res.status(400).json({ error: "Password is wrong" })
  }

  const token = jwt.sign({
    name: user.name,
    id: user._id
  }, process.env.TOKEN_SECRET)

  res.header("auth-token", token).json({
    error: null,
    data: {
      message: 'Login successful',
      token
    }
  })
})

module.exports = router
