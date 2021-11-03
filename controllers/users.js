const jwt = require('jsonwebtoken')
const Users = require('../repository/users')
const { HttpCode } = require('../config/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY
const EmailService = require('../services/email/service')
const {
  CreateSenderSendGrid,
  CreateSenderNodemailer,
} = require('../services/email/sender')

const signup = async (req, res, next) => {
  const { email, password, subscription } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email in use',
    })
  }
  try {
    const newUser = await Users.create({  email, password, subscription })
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer(),
    )

    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.verifyToken,
    )
    console.log(newUser.verifyToken);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        successEmail: statusEmail,
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  const isValidPassword = await user?.isValidPassword(password)
  if (!user || !isValidPassword || !user?.verify) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Email or password is wrong',
    })
  }
  const id = user._id
  const payload = { id }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
  await Users.updateToken(id, token)
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: {
      token,
    },
  })
}

const logout = async (req, res) => {
  const id = req.user._id
  await Users.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

const current = async (req, res) => {
  const userEmail = req.user.email
  const currentUser = await Users.findByEmail(userEmail)
  if(!currentUser) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    })
  }

  const {email, subscription} = currentUser
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: {
      email,
      subscription
    },
  })
}

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token)
  if (user) {
    await Users.updateTokenVerify(user._id, true, null)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        message: 'Success',
      },
    })
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: 'error',
    code: HttpCode.BAD_REQUEST,
    message: 'Invalid token',
  })
}

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    const { email, name, verifyToken } = user
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer(),
    )
    const statusEmail = await emailService.sendVerifyEmail(
      email,
      name,
      verifyToken,
    )
  }
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      message: 'Success',
    },
  })
}

// const updateSubscription = async (req, res) => {
//   const id = req.user._id
//   const subscription = req.body
//   const resault = await Users.updateSubscription(id, subscription)
//   if(resault) {
//     return res
//       .status(200)
//       .json({ status: 'success', code: 200, data: { resault } })
//   }
// }

module.exports = {
  signup,
  login,
  logout,
  current,
  verifyUser,
  repeatEmailForVerifyUser,
  // updateSubscription
}