const Joi = require('@hapi/joi')

const registerValidation = data => {
  const Schema = Joi.object({
    firstname: Joi.string().min(4).max(255),
    lastname: Joi.string().min(4).max(255),
    username: Joi.string().min(4).max(255),
    email: Joi.string().min(6).max(255).email(),
    password: Joi.string().min(6).max(1024),
  })

  return Schema.validate(data)
}

const loginValidation = data => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(255).email(),
    password: Joi.string().min(6).max(1024),
  })

  return Schema.validate(data)
}

module.exports = { registerValidation, loginValidation }