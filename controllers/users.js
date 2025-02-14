const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
const Users = require('../repository/users')
const path = require('path')
const mkdirp = require('mkdirp')
const UploadService = require('../services/file-upload')
const { HttpCode } = require('../config/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

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
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  const isValidPassword = await user.isValidPassword(password)
  if (!user || !isValidPassword) {
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

const uploadAvatar = async (req, res, next) => {
    const id = String(req.user._id)
    const file = req.file
    const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
    const destination = path.join(AVATAR_OF_USERS, id)
    await mkdirp(destination)
    const uploadService = new UploadService(destination)
    const avatarUrl = await uploadService.save(file, id)
    await Users.updateAvatar(id, avatarUrl)
  
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      date: {
        avatar: avatarUrl,
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
  uploadAvatar,
  // updateSubscription
}