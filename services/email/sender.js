// const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
require('dotenv').config()

// class CreateSenderSendGrid {
//   async send(msg) {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//     return await sgMail.send({ ...msg, from: 'k04erg0@gmail.com' })
//   }
// }

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'roman_koch@meta.ua',
        pass: process.env.PASSWORD,
      },
    }
    const transporter = nodemailer.createTransport(config)
    return await transporter.sendMail({ ...msg, from: 'roman_koch@meta.ua' })
  }
}

module.exports = { CreateSenderNodemailer }